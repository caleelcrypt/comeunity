'use client';
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from './AuthForm.module.css'; // Import CSS Module

// --- Types ---
type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  xp: number;
  own_referral_code: string;
  referred_by: string | null;
  created_at: string;
};

// --- Main Auth Component ---
const AuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [referralLocked, setReferralLocked] = useState(false);
  const [signupTouched, setSignupTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirm: false,
    referral: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // --- Helper Functions ---
  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // --- Validation Functions ---
  const isValidUsername = (str: string) => /^[a-z0-9]{3,20}$/.test(str);
  const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isPasswordStrong = (pwd: string) => {
    if (!pwd) return false;
    const lenOk = pwd.length >= 8 && pwd.length <= 16;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    return lenOk && hasLetter && hasNumber && hasSpecial;
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username) return false;
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();
    return !!data;
  };

  const isReferralCodeValid = async (code: string): Promise<boolean> => {
    if (!code || code.trim() === "") return false;
    const trimmed = code.trim().toUpperCase();
    
    if (trimmed === "CALEELCEO") return true;
    
    const { data } = await supabase
      .from("profiles")
      .select("own_referral_code")
      .eq("own_referral_code", trimmed)
      .single();
    return !!data;
  };

  const getReferrerUserByCode = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    
    if (trimmed === "CALEELCEO") {
      const { data } = await supabase
        .from("profiles")
        .select("id, xp")
        .eq("username", "caleel_ceo")
        .single();
      return data;
    }
    
    const { data } = await supabase
      .from("profiles")
      .select("id, xp")
      .eq("own_referral_code", trimmed)
      .single();
    return data;
  };

  const generateUniqueReferralCode = async (username: string): Promise<string> => {
    const candidate = username.toUpperCase();
    const { data } = await supabase
      .from("profiles")
      .select("own_referral_code")
      .eq("own_referral_code", candidate)
      .single();
    
    if (data) {
      const random = Math.floor(Math.random() * 1000);
      return `${candidate}${random}`;
    }
    return candidate;
  };

  const validateAllFields = async () => {
    const firstName = signupData.firstName.trim();
    const lastName = signupData.lastName.trim();
    const username = signupData.username.toLowerCase();
    const email = signupData.email.trim();
    const password = signupData.password;
    const confirmPwd = signupData.confirmPassword;
    const referralCode = signupData.referralCode.trim();
    
    const firstNameValid = firstName.length >= 2;
    const lastNameValid = lastName.length >= 2;
    const usernameFormatValid = isValidUsername(username);
    const usernameTaken = username ? await checkUsernameAvailability(username) : false;
    const usernameValid = usernameFormatValid && !usernameTaken;
    const emailValid = isValidEmail(email);
    const passwordStrong = isPasswordStrong(password);
    const confirmValid = password === confirmPwd && password.length > 0;
    const referralValid = referralCode.length > 0 && await isReferralCodeValid(referralCode);
    
    updateFieldValidation('firstName', firstNameValid, signupTouched.firstName);
    updateFieldValidation('lastName', lastNameValid, signupTouched.lastName);
    
    if (signupTouched.username && username) {
      const usernameErrorMsg = document.getElementById('usernameErrorMsg');
      const usernameSuccessMsg = document.getElementById('usernameSuccessMsg');
      const usernameField = document.getElementById('username') as HTMLInputElement;
      
      if (usernameFormatValid && !usernameTaken) {
        usernameField.classList.add(styles.validField);
        usernameField.classList.remove(styles.invalidField);
        if (usernameErrorMsg) usernameErrorMsg.innerText = '';
        if (usernameSuccessMsg) usernameSuccessMsg.innerHTML = '✅ Username available!';
      } else if (usernameFormatValid && usernameTaken) {
        usernameField.classList.add(styles.invalidField);
        usernameField.classList.remove(styles.validField);
        if (usernameErrorMsg) usernameErrorMsg.innerText = '⚠️ Username already taken';
        if (usernameSuccessMsg) usernameSuccessMsg.innerHTML = '';
      } else if (!usernameFormatValid && username) {
        usernameField.classList.add(styles.invalidField);
        usernameField.classList.remove(styles.validField);
        if (usernameErrorMsg) usernameErrorMsg.innerText = '⚠️ 3-20 lowercase letters & numbers only';
        if (usernameSuccessMsg) usernameSuccessMsg.innerHTML = '';
      }
    } else if (!signupTouched.username) {
      const usernameField = document.getElementById('username');
      if (usernameField) usernameField.classList.remove(styles.validField, styles.invalidField);
    }
    
    updateFieldValidation('signupEmail', emailValid, signupTouched.email);
    updateFieldValidation('signupPassword', passwordStrong, signupTouched.password);
    updateFieldValidation('signupConfirmPwd', confirmValid, signupTouched.confirm);
    updateFieldValidation('referralCodeInput', referralValid, signupTouched.referral);
    
    const firstNameError = document.getElementById('firstNameError');
    if (firstNameError) firstNameError.innerText = (signupTouched.firstName && !firstNameValid && firstName) ? '⚠️ First name required (min 2 chars)' : '';
    
    const lastNameError = document.getElementById('lastNameError');
    if (lastNameError) lastNameError.innerText = (signupTouched.lastName && !lastNameValid && lastName) ? '⚠️ Last name required (min 2 chars)' : '';
    
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    const emailSuccessMsg = document.getElementById('emailSuccessMsg');
    if (signupTouched.email && email) {
      if (emailValid) {
        if (emailErrorMsg) emailErrorMsg.innerText = '';
        if (emailSuccessMsg) emailSuccessMsg.innerHTML = '✅ Valid Gmail address';
      } else {
        if (emailErrorMsg) emailErrorMsg.innerText = '⚠️ Only @gmail.com email addresses are accepted';
        if (emailSuccessMsg) emailSuccessMsg.innerHTML = '';
      }
    }
    
    const passwordSuccessMsg = document.getElementById('passwordSuccessMsg');
    if (signupTouched.password && passwordStrong) {
      if (passwordSuccessMsg) passwordSuccessMsg.innerHTML = '✅ Strong password!';
    } else if (signupTouched.password && !passwordStrong) {
      if (passwordSuccessMsg) passwordSuccessMsg.innerHTML = '';
    }
    
    const confirmSuccessMsg = document.getElementById('confirmSuccessMsg');
    const confirmErrorMsg = document.getElementById('confirmErrorMsg');
    if (signupTouched.confirm && confirmValid) {
      if (confirmSuccessMsg) confirmSuccessMsg.innerHTML = '✅ Passwords match!';
      if (confirmErrorMsg) confirmErrorMsg.innerText = '';
    } else if (signupTouched.confirm && !confirmValid && confirmPwd) {
      if (confirmErrorMsg) confirmErrorMsg.innerText = '⚠️ Passwords do not match';
    }
    
    const referralSuccessMsg = document.getElementById('referralSuccessMsg');
    const referralErrorMsg = document.getElementById('referralErrorMsg');
    if (signupTouched.referral && referralValid) {
      if (referralSuccessMsg) referralSuccessMsg.innerHTML = '✅ Valid referral code! +50 XP bonus';
      if (referralErrorMsg) referralErrorMsg.innerText = '';
    } else if (signupTouched.referral && !referralValid && referralCode) {
      if (referralErrorMsg) referralErrorMsg.innerText = '⚠️ Invalid referral code';
    }
    
    updatePasswordReqs(password);
    
    const allValid = firstNameValid && lastNameValid && usernameValid && emailValid && passwordStrong && confirmValid && referralValid;
    const container = document.getElementById('authContainer');
    if (allValid && container) container.classList.add(styles.formValid);
    else if (container) container.classList.remove(styles.formValid);
    
    return allValid;
  };

  const updateFieldValidation = (fieldId: string, isValid: boolean, isTouched: boolean) => {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    if (!field) return;
    if (!isTouched || !field.value) {
      field.classList.remove(styles.validField, styles.invalidField);
      return;
    }
    if (isValid) {
      field.classList.add(styles.validField);
      field.classList.remove(styles.invalidField);
    } else {
      field.classList.add(styles.invalidField);
      field.classList.remove(styles.validField);
    }
  };

  const updatePasswordReqs = (password: string) => {
    const lenOk = password.length >= 8 && password.length <= 16;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const lengthReq = document.getElementById('lengthReq');
    const letterReq = document.getElementById('letterReq');
    const numberReq = document.getElementById('numberReq');
    const specialReq = document.getElementById('specialReq');
    
    if (lengthReq) lengthReq.innerHTML = lenOk ? '<i class="fas fa-check-circle"></i> 8-16 chars' : '<i class="fas fa-circle"></i> 8-16 chars';
    if (letterReq) letterReq.innerHTML = hasLetter ? '<i class="fas fa-check-circle"></i> Letter' : '<i class="fas fa-circle"></i> Letter';
    if (numberReq) numberReq.innerHTML = hasNumber ? '<i class="fas fa-check-circle"></i> Number' : '<i class="fas fa-circle"></i> Number';
    if (specialReq) specialReq.innerHTML = hasSpecial ? '<i class="fas fa-check-circle"></i> Special (!@#$%^&*)' : '<i class="fas fa-circle"></i> Special (!@#$%^&*)';
    
    [lengthReq, letterReq, numberReq, specialReq].forEach(el => {
      if (el && el.innerHTML.includes('check-circle')) el.classList.add(styles.reqPassValid);
      else if (el) el.classList.remove(styles.reqPassValid);
    });
  };

  const validateLoginFields = async () => {
    const email = loginEmail.trim();
    const password = loginPassword;
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');
    const container = document.getElementById('authContainer');
    const loginEmailFeedback = document.getElementById('loginEmailFeedback');
    const loginEmailSuccess = document.getElementById('loginEmailSuccess');
    const loginPasswordFeedback = document.getElementById('loginPasswordFeedback');
    const loginPasswordSuccess = document.getElementById('loginPasswordSuccess');
    
    if (password && loginPasswordFeedback && loginPasswordFeedback.innerHTML.includes('Incorrect')) {
      loginPasswordFeedback.innerHTML = '';
    }
    
    if (!email) {
      if (emailField) emailField.classList.remove(styles.validField, styles.invalidField);
      if (passwordField) passwordField.classList.remove(styles.validField, styles.invalidField);
      if (container) container.classList.remove(styles.loginValid);
      if (loginEmailFeedback) loginEmailFeedback.innerHTML = '';
      if (loginEmailSuccess) loginEmailSuccess.innerHTML = '';
      if (loginPasswordFeedback) loginPasswordFeedback.innerHTML = '';
      if (loginPasswordSuccess) loginPasswordSuccess.innerHTML = '';
      return;
    }
    
    const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@gmail\.com$/;
    const isValidGmailFormat = emailRegex.test(email);
    const endsWithGmail = email.endsWith('@gmail.com');
    
    if (email && !endsWithGmail) {
      if (loginEmailFeedback) loginEmailFeedback.innerHTML = '';
      if (loginEmailSuccess) loginEmailSuccess.innerHTML = '✏️ Keep typing... must end with @gmail.com';
      if (emailField) {
        emailField.classList.remove(styles.validField, styles.invalidField);
      }
    } else if (email && endsWithGmail && !isValidGmailFormat) {
      if (emailField) {
        emailField.classList.add(styles.invalidField);
        emailField.classList.remove(styles.validField);
      }
      if (loginEmailFeedback) loginEmailFeedback.innerHTML = '❌ Email must start with a letter (no numbers or symbols at start)';
      if (loginEmailSuccess) loginEmailSuccess.innerHTML = '';
    } else if (email && isValidGmailFormat) {
      if (loginEmailFeedback) loginEmailFeedback.innerHTML = '';
      if (loginEmailSuccess) loginEmailSuccess.innerHTML = '✓ Checking email...';
      
      const { data: targetUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();
      
      if (targetUser) {
        if (emailField) {
          emailField.classList.add(styles.validField);
          emailField.classList.remove(styles.invalidField);
        }
        if (loginEmailSuccess) loginEmailSuccess.innerHTML = '✅ Email found!';
        
        if (password) {
          if (targetUser.password === password) {
            if (passwordField) {
              passwordField.classList.add(styles.validField);
              passwordField.classList.remove(styles.invalidField);
            }
            if (loginPasswordFeedback) loginPasswordFeedback.innerHTML = '';
            if (loginPasswordSuccess) loginPasswordSuccess.innerHTML = '✅ Correct password!';
            if (container) container.classList.add(styles.loginValid);
          } else {
            if (passwordField) {
              passwordField.classList.add(styles.invalidField);
              passwordField.classList.remove(styles.validField);
            }
            if (loginPasswordFeedback) loginPasswordFeedback.innerHTML = '❌ Incorrect password';
            if (loginPasswordSuccess) loginPasswordSuccess.innerHTML = '';
            if (container) container.classList.remove(styles.loginValid);
          }
        } else {
          if (passwordField) passwordField.classList.remove(styles.validField, styles.invalidField);
          if (loginPasswordFeedback) loginPasswordFeedback.innerHTML = '';
          if (loginPasswordSuccess) loginPasswordSuccess.innerHTML = '';
          if (container) container.classList.remove(styles.loginValid);
        }
      } else {
        if (emailField) {
          emailField.classList.add(styles.invalidField);
          emailField.classList.remove(styles.validField);
        }
        if (loginEmailFeedback) loginEmailFeedback.innerHTML = '❌ Email not found. Please sign up first.';
        if (loginEmailSuccess) loginEmailSuccess.innerHTML = '';
        if (passwordField) passwordField.classList.remove(styles.validField, styles.invalidField);
        if (loginPasswordFeedback) loginPasswordFeedback.innerHTML = '';
        if (loginPasswordSuccess) loginPasswordSuccess.innerHTML = '';
        if (container) container.classList.remove(styles.loginValid);
      }
    }
  };

  // --- Supabase Auth Logic ---
  useEffect(() => {
    updateReferralHelper();
    applyReferralAutoLock();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeTab === "signup" && !signupData.referralCode && !referralLocked) {
      setSignupData(prev => ({ ...prev, referralCode: "CALEELCEO" }));
      setSignupTouched(prev => ({ ...prev, referral: true }));
      validateAllFields();
    }
  }, [activeTab, referralLocked]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    } else if (tab === 'login') {
      setActiveTab('login');
    }
  }, []);

  const fetchUserProfile = async (authUser: any) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    
    if (error) {
      // If profile not found, it's okay - user just signed up
      if (error.code === 'PGRST116') {
        console.log("Profile not found yet, waiting for creation...");
        return;
      }
      console.error("Error fetching profile:", error);
      return;
    }
    
    if (data) {
      setUser(data as UserProfile);
    }
  } catch (err) {
    console.error("Unexpected error fetching profile:", err);
  }
};

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      showToastMsg("❌ Please enter both email and password");
      return;
    }
    
    if (!loginEmail.endsWith('@gmail.com') || !isValidEmail(loginEmail)) {
      showToastMsg("❌ Only @gmail.com email addresses are allowed");
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    
    if (error) {
      showToastMsg(`❌ ${error.message}`);
    } else if (data.user) {
      showToastMsg(`✨ Welcome back!`);
      window.location.href = '/feed';
    }
  };

  const handleSignup = async () => {
    const newTouched = { ...signupTouched };
    Object.keys(newTouched).forEach(k => newTouched[k as keyof typeof newTouched] = true);
    setSignupTouched(newTouched);
    
    const isValid = await validateAllFields();
    if (!isValid) {
      showToastMsg("❌ Please fix all fields before signing up");
      return;
    }
    
    setLoading(true);
    
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", signupData.email)
      .single();
    if (existingUser) {
      showToastMsg("❌ Email already registered");
      setLoading(false);
      return;
    }
    
    const usernameTaken = await checkUsernameAvailability(signupData.username);
    if (usernameTaken) {
      showToastMsg("❌ Username already taken");
      setLoading(false);
      return;
    }
    
    const referrer = await getReferrerUserByCode(signupData.referralCode);
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          username: signupData.username,
        }
      }
    });
    
    if (signUpError) {
      showToastMsg(`❌ Signup failed: ${signUpError.message}`);
      setLoading(false);
      return;
    }
    
    if (!authData.user) {
      showToastMsg("❌ Signup failed, please try again");
      setLoading(false);
      return;
    }
    
    const ownReferralCode = await generateUniqueReferralCode(signupData.username);
    
    const newProfile = {
      id: authData.user.id,
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      full_name: `${signupData.firstName} ${signupData.lastName}`,
      username: signupData.username,
      email: signupData.email,
      xp: referrer ? 50 : 50,
      own_referral_code: ownReferralCode,
      referred_by: referrer?.id || null,
    };
    
    console.log("Attempting to create profile with data:", newProfile);
    
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([newProfile]);
    if (profileError) {
      console.error("Profile creation error - Full details:", {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
        data: profileError
      });
      showToastMsg(`❌ Profile creation failed: ${profileError.message}`);
      setLoading(false);
      return;
    }
    
    if (referrer) {
      await supabase
        .from("profiles")
        .update({ xp: (referrer.xp || 0) + 50 })
        .eq("id", referrer.id);
      
      await supabase
        .from("profiles")
        .update({ xp: 100 })
        .eq("id", authData.user.id);
    }
    
    showToastMsg(`🎉 Welcome ${signupData.firstName}! +${referrer ? 100 : 50} XP earned.`);
    setLoading(false);
    window.location.href = '/feed';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setSignupData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    });
    setSignupTouched({
      firstName: false,
      lastName: false,
      username: false,
      email: false,
      password: false,
      confirm: false,
      referral: false
    });
    setReferralLocked(false);
    
    const inputIds = ['firstName', 'lastName', 'username', 'signupEmail', 'signupPassword', 'signupConfirmPwd', 'referralCodeInput'];
    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove(styles.validField, styles.invalidField);
    });
    
    const container = document.getElementById('authContainer');
    if (container) container.classList.remove(styles.formValid, styles.loginValid);
    
    showToastMsg("Logged out");
  };

  const getReferralFromUrl = () => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || params.get('referral');
  };

  const applyReferralAutoLock = () => {
    const urlRef = getReferralFromUrl();
    if (urlRef && !referralLocked && activeTab === "signup") {
      setSignupData(prev => ({ ...prev, referralCode: urlRef }));
      setSignupTouched(prev => ({ ...prev, referral: true }));
      setReferralLocked(true);
      
      const hintDiv = document.getElementById('referralHintContainer');
      if (hintDiv) hintDiv.innerHTML = `<i class="fas fa-link" style="color:#10b981;"></i> Referral locked from invite link. <span class="referral-locked-badge">🔒 ${urlRef}</span>`;
      validateAllFields();
    }
  };

  const updateReferralHelper = async () => {
    const hintDiv = document.getElementById('referralHintContainer');
    if (!hintDiv || referralLocked) return;
    
    hintDiv.innerHTML = `<i class="fas fa-star text-amber-500"></i> use code: <span class="copy-tag" onclick="window.copyDemoReferralCode && window.copyDemoReferralCode('CALEELCEO')" style="background: #ff4d6d20; color: #ff4d6d;"><i class="far fa-copy"></i> CALEELCEO</span> <span style="margin-left:auto;">✨ +50XP for you and referrer!</span>`;
  };

  const copyOwnRefCode = () => {
    const code = user?.own_referral_code;
    if (code) {
      navigator.clipboard.writeText(code);
      showToastMsg(`📋 Copied: ${code}`);
    }
  };

  const copyDemoReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToastMsg(`📋 Copied code: ${code}`);
  };

  const switchPanel = (panel: "login" | "signup") => {
    setActiveTab(panel);
    if (panel === "signup") {
      setTimeout(() => {
        updateReferralHelper();
        applyReferralAutoLock();
        validateAllFields();
      }, 100);
    }
  };

  useEffect(() => {
    (window as any).copyDemoReferralCode = copyDemoReferralCode;
    (window as any).copyOwnRefCode = copyOwnRefCode;
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "username") {
      value = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    setSignupData(prev => ({ ...prev, [field]: value }));
    setSignupTouched(prev => ({ ...prev, [field]: true }));
    validateAllFields();
  };

  // Dashboard render
  if (user) {
    return (
      <>
        <div className="dashboard-mock">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div className="dashboard-heading" style={{ fontSize: "44px", marginBottom: "8px" }}>COMEUNITY</div>
            <div style={{ color: "#ff7b9c", fontWeight: "500", letterSpacing: "1px" }}>Create.Connect.Collab.</div>
          </div>
          
          <div className="dashboard-card">
            <div className="info-row">
              <div style={{ fontWeight: "700", fontSize: "20px", color: "white", marginBottom: "8px" }}>{user.full_name}</div>
              <div style={{ color: "#ffb7c4", marginBottom: "4px" }}><i className="fas fa-at"></i> @{user.username}</div>
              <div style={{ color: "#9ca3af", marginBottom: "4px" }}><i className="far fa-envelope"></i> {user.email}</div>
              <div style={{ color: "#9ca3af" }}><i className="fas fa-link"></i> Referred by: {user.referred_by ? "Community Member" : "none"}</div>
              <div style={{ marginTop: "12px" }}><span className="xp-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", padding: "6px 14px" }}>⭐ {user.xp || 0} XP</span></div>
            </div>
          </div>
          
          <div className="dashboard-card" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.1))" }}>
            <p style={{ color: "#10b981", fontWeight: "600", marginBottom: "12px" }}><i className="fas fa-star"></i> YOUR XP BALANCE</p>
            <div style={{ fontSize: "56px", fontWeight: "800", color: "#fbbf24", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>{user.xp}</div>
            <div className="dashboard-text-muted" style={{ marginTop: "8px" }}>💡 Invite friends → +50 XP each!</div>
          </div>
          
          <div className="dashboard-card">
            <p style={{ color: "#ffb7c4", fontWeight: "600", marginBottom: "16px" }}><i className="fas fa-qrcode"></i> YOUR UNIQUE REFERRAL CODE</p>
            <div className="referral-box">
              <code className="referral-code-text" style={{ color: "#ffb347", fontWeight: "700" }}>{user.own_referral_code}</code>
              <button onClick={copyOwnRefCode} style={{ background: "rgba(255,255,255,0.1)", border: "none", padding: "8px 16px", borderRadius: "40px", color: "white", cursor: "pointer", fontSize: "14px" }}>
                <i className="far fa-copy"></i> Copy
              </button>
            </div>
            <p className="dashboard-text-muted" style={{ marginTop: "12px", textAlign: "center" }}>Share link: https://comeunity.com/?ref=<span style={{ color: "#ffb347" }}>{user.own_referral_code}</span></p>
          </div>
          
          <button className="btn-primary" onClick={handleLogout} style={{ marginTop: "16px" }}>Logout</button>
        </div>
        {toast && <div className="toast-msg">{toast}</div>}
      </>
    );
  }

  // Auth form render
  return (
    <>
      <div className={styles.authContainer} id="authContainer">
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>COMEUNITY</div>
          <div className={styles.brandTagline}>Create.Connect.Collab.</div>
        </div>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "login" ? styles.tabBtnActive : ""}`} 
            onClick={() => switchPanel("login")}
          >
            Log in
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "signup" ? styles.tabBtnActive : ""}`} 
            onClick={() => switchPanel("signup")}
          >
            Sign up
          </button>
        </div>

        {/* LOGIN PANEL */}
        {activeTab === "login" && (
          <div className={styles.formPanel}>
            <div className={styles.inputField}>
              <label><i className="far fa-envelope"></i> Email address (@gmail.com only)</label>
              <input 
                type="email" 
                id="loginEmail" 
                placeholder="caleel@gmail.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onInput={validateLoginFields}
              />
              <div className={styles.fieldErrorMsg} id="loginEmailFeedback"></div>
              <div className={styles.fieldSuccessMsg} id="loginEmailSuccess"></div>
            </div>
            <div className={styles.inputField}>
              <label><i className="fas fa-lock"></i> Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="loginPassword" 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onInput={validateLoginFields}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#ff7b9c',
                    cursor: 'pointer'
                  }}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
              <div className={styles.fieldErrorMsg} id="loginPasswordFeedback"></div>
              <div className={styles.fieldSuccessMsg} id="loginPasswordSuccess"></div>
            </div>
            <button className={styles.btnPrimary} onClick={handleLogin} disabled={loading}>Welcome back →</button>
            <div className={styles.demoWarning}>✨ Sign in with your Gmail address</div>
          </div>
        )}

        {/* SIGNUP PANEL */}
        {activeTab === "signup" && (
          <div className={styles.formPanel}>
            <div className={styles.inputField}>
              <label>First name</label>
              <input 
                type="text" 
                id="firstName" 
                placeholder="CALEEL"
                value={signupData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              <div className={styles.fieldErrorMsg} id="firstNameError"></div>
            </div>
            <div className={styles.inputField}>
              <label>Last name</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder="CEO"
                value={signupData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              <div className={styles.fieldErrorMsg} id="lastNameError"></div>
            </div>
            
            <div className={`${styles.inputField} ${styles.usernamePrefix}`}>
              <label>Username <span style={{ color: "#ff7b9c" }}>(lowercase letters & numbers, 3-20 chars)</span></label>
              <div style={{ position: "relative" }}>
                <span className={styles.atSymbol}>@</span>
                <input 
                  type="text" 
                  id="username" 
                  placeholder="caleel_ceo" 
                  style={{ paddingLeft: "48px" }}
                  value={signupData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </div>
              <div className={styles.fieldErrorMsg} id="usernameErrorMsg"></div>
              <div className={styles.fieldSuccessMsg} id="usernameSuccessMsg"></div>
            </div>
            
            <div className={styles.inputField}>
              <label>Email address <span style={{ color: "#ff7b9c" }}>(only @gmail.com allowed)</span></label>
              <input 
                type="email" 
                id="signupEmail" 
                placeholder="caleel@gmail.com"
                value={signupData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <div className={styles.fieldErrorMsg} id="emailErrorMsg"></div>
              <div className={styles.fieldSuccessMsg} id="emailSuccessMsg"></div>
            </div>
            
            <div className={styles.inputField}>
              <label>Password (8-16 chars, letter + number + special character)</label>
              <input 
                type="password" 
                id="signupPassword" 
                placeholder="••••••••"
                value={signupData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <div className={styles.passwordRequirements} id="pwdReqs">
                <span className={styles.reqPass} id="lengthReq"><i className="fas fa-circle"></i> 8-16 chars</span>
                <span className={styles.reqPass} id="letterReq"><i className="fas fa-circle"></i> Letter</span>
                <span className={styles.reqPass} id="numberReq"><i className="fas fa-circle"></i> Number</span>
                <span className={styles.reqPass} id="specialReq"><i className="fas fa-circle"></i> Special (!@#$%^&*)</span>
              </div>
              <div className={styles.fieldSuccessMsg} id="passwordSuccessMsg"></div>
            </div>
            <div className={styles.inputField}>
              <label>Confirm password</label>
              <input 
                type="password" 
                id="signupConfirmPwd" 
                placeholder="confirm"
                value={signupData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
              <div className={styles.fieldErrorMsg} id="confirmErrorMsg"></div>
              <div className={styles.fieldSuccessMsg} id="confirmSuccessMsg"></div>
            </div>

            <div className={styles.inputField}>
              <label><i className="fas fa-gift"></i> Referral code <span style={{ color: "#ff7b9c" }}>*</span></label>
              <input 
                type="text" 
                id="referralCodeInput" 
                placeholder="Enter referral code (e.g., COMEUNITY2026)"
                value={signupData.referralCode}
                onChange={(e) => handleInputChange("referralCode", e.target.value)}
                readOnly={referralLocked}
                className={referralLocked ? styles.readonlyRef : ""}
              />
              <div className={styles.referralHint} id="referralHintContainer"></div>
              <div className={styles.fieldErrorMsg} id="referralErrorMsg"></div>
              <div className={styles.fieldSuccessMsg} id="referralSuccessMsg"></div>
            </div>
            
            <button className={styles.btnPrimary} onClick={handleSignup} disabled={loading}>Find your People →</button>
            <div className={styles.demoWarning}>⭐ Each referral gives you +50 XP & referrer +50 XP</div>
          </div>
        )}
      </div>
      {toast && <div className={styles.toastMsg}>{toast}</div>}
    </>
  );
};

export default AuthForm;