import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Review } from '../types';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (reviewsError) throw reviewsError;
      
      const formattedReviews = reviewsData?.map(review => ({
        ...review,
        user_name: review.profiles?.full_name || review.profiles?.username,
        user_avatar: review.profiles?.avatar_url
      })) || [];
      
      setReviews(formattedReviews);
      setTotalReviews(formattedReviews.length);
      
      // Calculate average rating
      if (formattedReviews.length > 0) {
        const sum = formattedReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / formattedReviews.length;
        setAverageRating(parseFloat(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
      
      return formattedReviews;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's own review
  const fetchUserReview = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (reviewError && reviewError.code !== 'PGRST116') {
        throw reviewError;
      }
      
      setUserReview(reviewData || null);
      return reviewData || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user review');
      return null;
    }
  }, []);

  // Create a new review
  const createReview = useCallback(async (rating: number, comment: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Check if user already has a review
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (existingReview) {
        throw new Error('You have already submitted a review');
      }
      
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          rating: rating,
          comment: comment.trim()
        })
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .single();
      
      if (reviewError) throw reviewError;
      
      const formattedReview = {
        ...reviewData,
        user_name: reviewData.profiles?.full_name || reviewData.profiles?.username,
        user_avatar: reviewData.profiles?.avatar_url
      };
      
      // Add XP for writing a review
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 50 });
      
      // Add coins for writing a review
      await supabase.rpc('add_coins', { user_id: user.id, coin_amount: 10 });
      
      setReviews(prev => [formattedReview, ...prev]);
      setTotalReviews(prev => prev + 1);
      setUserReview(formattedReview);
      
      // Recalculate average rating
      const newSum = reviews.reduce((acc, r) => acc + r.rating, 0) + rating;
      const newAvg = newSum / (reviews.length + 1);
      setAverageRating(parseFloat(newAvg.toFixed(1)));
      
      return formattedReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reviews]);

  // Update existing review
  const updateReview = useCallback(async (reviewId: string, rating: number, comment: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .update({
          rating: rating,
          comment: comment.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('user_id', user.id)
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .single();
      
      if (reviewError) throw reviewError;
      
      const formattedReview = {
        ...reviewData,
        user_name: reviewData.profiles?.full_name || reviewData.profiles?.username,
        user_avatar: reviewData.profiles?.avatar_url
      };
      
      setReviews(prev => prev.map(r => r.id === reviewId ? formattedReview : r));
      setUserReview(formattedReview);
      
      // Recalculate average rating
      const otherReviews = reviews.filter(r => r.id !== reviewId);
      const newSum = otherReviews.reduce((acc, r) => acc + r.rating, 0) + rating;
      const newAvg = newSum / (otherReviews.length + 1);
      setAverageRating(parseFloat(newAvg.toFixed(1)));
      
      return formattedReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reviews]);

  // Delete review
  const deleteReview = useCallback(async (reviewId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const reviewToDelete = reviews.find(r => r.id === reviewId);
      if (!reviewToDelete) throw new Error('Review not found');
      
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setTotalReviews(prev => prev - 1);
      setUserReview(null);
      
      // Recalculate average rating
      if (reviews.length - 1 > 0) {
        const remainingReviews = reviews.filter(r => r.id !== reviewId);
        const newSum = remainingReviews.reduce((acc, r) => acc + r.rating, 0);
        const newAvg = newSum / remainingReviews.length;
        setAverageRating(parseFloat(newAvg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      return false;
    } finally {
      setLoading(false);
    }
  }, [reviews]);

  // Get reviews by rating filter
  const getReviewsByRating = useCallback((rating: number | 'all') => {
    if (rating === 'all') return reviews;
    return reviews.filter(r => r.rating === rating);
  }, [reviews]);

  // Get rating distribution
  const getRatingDistribution = useCallback(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [reviews]);

  // Get percentage for each rating
  const getRatingPercentages = useCallback(() => {
    if (totalReviews === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const distribution = getRatingDistribution();
    return {
      1: (distribution[1] / totalReviews) * 100,
      2: (distribution[2] / totalReviews) * 100,
      3: (distribution[3] / totalReviews) * 100,
      4: (distribution[4] / totalReviews) * 100,
      5: (distribution[5] / totalReviews) * 100
    };
  }, [totalReviews, getRatingDistribution]);

  // Subscribe to real-time reviews
  useEffect(() => {
    const subscription = supabase
      .channel('reviews')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews'
        },
        async (payload) => {
          // Fetch the full review with profile
          const { data: newReview } = await supabase
            .from('reviews')
            .select(`
              *,
              profiles:user_id (username, full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (newReview) {
            const formattedReview = {
              ...newReview,
              user_name: newReview.profiles?.full_name || newReview.profiles?.username,
              user_avatar: newReview.profiles?.avatar_url
            };
            
            setReviews(prev => [formattedReview, ...prev]);
            setTotalReviews(prev => prev + 1);
            
            // Update average rating
            const newSum = reviews.reduce((acc, r) => acc + r.rating, 0) + formattedReview.rating;
            const newAvg = newSum / (reviews.length + 1);
            setAverageRating(parseFloat(newAvg.toFixed(1)));
          }
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [reviews]);

  return {
    reviews,
    loading,
    averageRating,
    totalReviews,
    userReview,
    error,
    fetchReviews,
    fetchUserReview,
    createReview,
    updateReview,
    deleteReview,
    getReviewsByRating,
    getRatingDistribution,
    getRatingPercentages
  };
};