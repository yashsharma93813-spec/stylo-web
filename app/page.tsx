"use client";

// =========================================================================
// 1. IMPORTS & HOOKS
// =========================================================================
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Upload, Shirt, Calendar, Star, Heart, 
  BookmarkCheck, Trash2, Loader2, Share2, Check, Zap, 
  ExternalLink, User, LogOut, History, Lock, Mail, X, 
  SlidersHorizontal, CheckCircle2, Globe, Download, 
  Camera, Image as ImageIcon, CloudSun, ShieldCheck, 
  AlertTriangle 
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// =========================================================================
// 2. MULTI-LANGUAGE TRANSLATION DICTIONARY
// =========================================================================
const translations = {
  English: {
    tagline: "Couture Intelligence",
    stylistTab: "Stylist",
    historyTab: "History",
    closetTab: "Closet",
    loginBtn: "Login",
    logoutBtn: "Logout",
    weatherPill: "Live Weather",
    dnaBannerTitle: "Style DNA & Weather Sync",
    dnaBannerEdit: "Configure",
    uploadTitle: "Upload Outfit / Self Photo",
    takePhotoBtn: "Camera",
    uploadGalleryBtn: "Gallery",
    uploadSubtext: "Auto-compressed for instant scan",
    retakePhoto: "Retake",
    occasionTitle: "Select Occasion",
    occasions: ["Casual", "College / Work", "Party Night", "Formal", "Date"],
    generateBtn: "Generate Weather-Adaptive Fit",
    optionClassic: "Option 1: Classic",
    optionBold: "Option 2: Bold",
    topwear: "TOPWEAR",
    bottomwear: "BOTTOMWEAR",
    footwear: "FOOTWEAR",
    shopBtn: "Shop",
    paletteTitle: "Personalized Palette:",
    stylistNote: "Stylist Note:",
    downloadCard: "Download Story Card",
    uploadAlert: "Please upload or capture a photo first!",
    historyHeading: "Automatic Scan History",
    historyLoginPrompt: "Log in to auto-save scan history to the cloud!",
    historyEmpty: "No history found. Go to Stylist tab and scan your first outfit!",
    scannedOn: "Scanned on:",
    closetHeading: "Your Favorite Fits",
    closetLoginPrompt: "Log in to save and access your favorite outfits!",
    closetEmpty: "No outfits saved yet. Tap ❤️ on any recommendation to save it!",
    privacyHeading: "Privacy & App Store Compliance",
    privacySub: "Your photos are processed in memory and never sold. Delete your data anytime.",
    deleteAccountBtn: "Delete All My Cloud Data",
    dnaModalTitle: "Style DNA & Preferences",
    dnaModalSub: "AI adapts language, weather, cuts, and colors to your profile.",
    langSection: "Preferred Language / भाषा",
    skinSection: "Skin Undertone",
    heightSection: "Height Proportion",
    buildSection: "Body Build / Frame",
    styleSection: "Go-to Aesthetic",
    saveDnaBtn: "Save Profile Preferences",
    authLoginTitle: "Welcome Back to Stylo",
    authLoginSub: "Login to sync history & closet across devices",
    authSignupTitle: "Create your Stylo Account",
    authSignupSub: "Sign up to unlock personalized style memory",
    googleSignIn: "Continue with Google",
    orDivider: "or continue with email",
    emailLabel: "Email",
    passwordLabel: "Password",
    signInAction: "Sign In",
    signUpAction: "Create Account",
    toggleToSignup: "Don't have an account? Sign Up",
    toggleToLogin: "Already have an account? Sign In",
    loadingSteps: [
      "Analyzing silhouette & real-time weather...",
      "Matching fabric & undertone coordinates...",
      "Curating tailored aesthetic fits...",
    ],
  },
  Hinglish: {
    tagline: "AI Personal Stylist",
    stylistTab: "Stylist",
    historyTab: "History",
    closetTab: "Closet",
    loginBtn: "Login",
    logoutBtn: "Logout",
    weatherPill: "Mausam",
    dnaBannerTitle: "Style DNA & Mausam Sync",
    dnaBannerEdit: "Badlo",
    uploadTitle: "Outfit / Khud ki Photo Upload Karo",
    takePhotoBtn: "Camera",
    uploadGalleryBtn: "Gallery",
    uploadSubtext: "Fast scanning ke liye auto-compress hogi",
    retakePhoto: "Change",
    occasionTitle: "Occasion Select Karo",
    occasions: ["Casual", "College / Work", "Party Night", "Formal", "Date"],
    generateBtn: "Mausam & DNA Ke Hisab Se Fit Banao",
    optionClassic: "Option 1: Classic",
    optionBold: "Option 2: Bold",
    topwear: "TOPWEAR",
    bottomwear: "BOTTOMWEAR",
    footwear: "FOOTWEAR",
    shopBtn: "Shop",
    paletteTitle: "Color Palette:",
    stylistNote: "Stylist Tip:",
    downloadCard: "Download Story Card",
    uploadAlert: "Pehle photo click ya upload karo!",
    historyHeading: "Automatic Scan History",
    historyLoginPrompt: "History ko cloud pe save karne ke liye login karo!",
    historyEmpty: "Abhi koi history nahi hai. Stylist tab pe jaake scan karo!",
    scannedOn: "Scan hua:",
    closetHeading: "Saved Favorite Fits",
    closetLoginPrompt: "Saved fits dekhne ke liye login karo!",
    closetEmpty: "Abhi koi outfit save nahi kiya. Recommendation aane pe ❤️ dabao!",
    privacyHeading: "Privacy & App Policy",
    privacySub: "Aapki photo kabhi sell nahi hoti. Aap jab chahe apna data delete kar sakte hain.",
    deleteAccountBtn: "Mera Sara Data Delete Karo",
    dnaModalTitle: "Style DNA & Settings",
    dnaModalSub: "AI mausam, fitting aur colors ko customize karega.",
    langSection: "Language / भाषा Chuno",
    skinSection: "Skin Tone",
    heightSection: "Height",
    buildSection: "Body Frame",
    styleSection: "Style Preference",
    saveDnaBtn: "Settings Save Karo",
    authLoginTitle: "Stylo mein Welcome Back",
    authLoginSub: "History aur closet sync karne ke liye login karo",
    authSignupTitle: "Apna Stylo Account Banao",
    authSignupSub: "Personal style memory ke liye sign up karo",
    googleSignIn: "Google se Continue karo",
    orDivider: "ya email se karo",
    emailLabel: "Email",
    passwordLabel: "Password",
    signInAction: "Sign In",
    signUpAction: "Account Banao",
    toggleToSignup: "Account nahi hai? Sign Up karo",
    toggleToLogin: "Pehle se account hai? Sign In karo",
    loadingSteps: [
      "Photo aur live mausam analyze ho raha hai...",
      "Skin undertone & fabric match ho raha hai...",
      "Classic & Bold looks curate ho rahe hain...",
    ],
  },
  Hindi: {
    tagline: "एआई पर्सनल स्टाइलिस्ट",
    stylistTab: "स्टाइलिस्ट",
    historyTab: "इतिहास",
    closetTab: "अलमारी (सेव्ड)",
    loginBtn: "लॉग इन",
    logoutBtn: "लॉग आउट",
    weatherPill: "मौसम",
    dnaBannerTitle: "स्टाइल डीएनए और मौसम सिंक",
    dnaBannerEdit: "बदलें",
    uploadTitle: "कपड़ों या खुद की फोटो अपलोड करें",
    takePhotoBtn: "कैमरा (Camera)",
    uploadGalleryBtn: "गैलरी (Gallery)",
    uploadSubtext: "तेज स्कैनिंग के लिए अपने आप ऑप्टिमाइज़ होगी",
    retakePhoto: "बदलें",
    occasionTitle: "अवसर / मौक़ा चुनें",
    occasions: ["कैजुअल (Casual)", "कॉलेज / वर्क", "पार्टी नाइट", "फॉर्मल (Formal)", "डेट (Date)"],
    generateBtn: "मौसम अनुसार एआई स्टाइल पाएं",
    optionClassic: "विकल्प 1: क्लासिक",
    optionBold: "विकल्प 2: बोल्ड लुक",
    topwear: "ऊपरी पहनावा (TOPWEAR)",
    bottomwear: "निचला पहनावा (BOTTOMWEAR)",
    footwear: "जूते / फुटवियर (FOOTWEAR)",
    shopBtn: "खरीदें",
    paletteTitle: "रंग संयोजन (Palette):",
    stylistNote: "स्टाइलिस्ट की सलाह:",
    downloadCard: "स्टोरी कार्ड डाउनलोड करें",
    uploadAlert: "कृपया पहले एक फोटो क्लिक या अपलोड करें!",
    historyHeading: "स्वचालित स्कैन इतिहास",
    historyLoginPrompt: "इतिहास को सुरक्षित रखने के लिए लॉग इन करें!",
    historyEmpty: "अभी कोई इतिहास नहीं है। पहली फोटो स्कैन करें!",
    scannedOn: "स्कैन की तारीख:",
    closetHeading: "पसंदीदा आउटफिट्स",
    closetLoginPrompt: "अपने पसंदीदा आउटफिट्स देखने के लिए लॉग इन करें!",
    closetEmpty: "अभी तक कोई आउटफिट सेव नहीं है। सुझाव आने पर ❤️ दबाएं!",
    privacyHeading: "गोपनीयता और ऐप नीतियां",
    privacySub: "आपकी तस्वीरें सुरक्षित हैं। आप कभी भी अपना डेटा मिटा सकते हैं।",
    deleteAccountBtn: "मेरा सारा क्लाउड डेटा मिटाएं",
    dnaModalTitle: "स्टाइल डीएनए और प्राथमिकताएं",
    dnaModalSub: "एआई मौसम, कद और रंग के अनुसार सुझाव देगा।",
    langSection: "पसंदीदा भाषा (Language)",
    skinSection: "त्वचा का रंग (Skin Tone)",
    heightSection: "कद / लंबाई (Height)",
    buildSection: "शारीरिक बनावट (Body Build)",
    styleSection: "पसंदीदा स्टाइल",
    saveDnaBtn: "प्राथमिकताएं सुरक्षित करें",
    authLoginTitle: "Stylo में आपका स्वागत है",
    authLoginSub: "डेटा सिंक करने के लिए लॉग इन करें",
    authSignupTitle: "नया Stylo खाता बनाएं",
    authSignupSub: "व्यक्तिगत स्टाइल अनुभव के लिए साइन अप करें",
    googleSignIn: "गूगल (Google) से जारी रखें",
    orDivider: "या ईमेल का उपयोग करें",
    emailLabel: "ईमेल (Email)",
    passwordLabel: "पासवर्ड (Password)",
    signInAction: "लॉग इन करें",
    signUpAction: "खाता बनाएं",
    toggleToSignup: "खाता नहीं है? साइन अप करें",
    toggleToLogin: "पहले से खाता है? लॉग इन करें",
    loadingSteps: [
      "फोटो और वर्तमान मौसम का विश्लेषण हो रहा है...",
      "स्किन टोन और कपड़ों के फैब्रिक का मिलान जारी है...",
      "शानदार आउटफिट विकल्प तैयार किए जा रहे हैं...",
    ],
  }
};

// =========================================================================
// 3. BRAND LOGO
// =========================================================================
function StyloLogo({ tagline }: { tagline: string }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 p-[1.5px] shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-all duration-300">
        <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-rose-500/20 animate-pulse" />
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
        </div>
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-amber-200 bg-clip-text text-transparent">
            STYLO
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-400 rounded-full">
            AI
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
          {tagline}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState<"English" | "Hinglish" | "Hindi">("Hinglish");
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<"stylist" | "history" | "closet">("stylist");
  const [selectedOccasion, setSelectedOccasion] = useState("Casual");
  
  const [weatherText, setWeatherText] = useState("Clear 29°C");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const [recommendations, setRecommendations] = useState<any[] | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);

  // Style DNA States
  const [showDnaModal, setShowDnaModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [skinTone, setSkinTone] = useState("Warm Olive / Wheatish");
  const [height, setHeight] = useState("Average (5'7 - 5'11)");
  const [bodyBuild, setBodyBuild] = useState("Athletic / Medium");
  const [preferredStyle, setPreferredStyle] = useState("Clean Minimalist");

  const languagesList = [
    { id: "English", label: "English" },
    { id: "Hinglish", label: "Hinglish" },
    { id: "Hindi", label: "हिंदी" }
  ];

  const skinToneOptions = ["Fair / Cool", "Warm Olive / Wheatish", "Tan / Golden", "Deep / Rich"];
  const heightOptions = ["Compact (Under 5'7)", "Average (5'7 - 5'11)", "Tall (6'0+)"];
  const buildOptions = ["Slim / Lean", "Athletic / Medium", "Broad / Heavy"];
  const styleOptions = ["Clean Minimalist", "Old Money / Dapper", "Streetwear Edge", "Smart Casual"];

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [historyFits, setHistoryFits] = useState<any[]>([]);
  const [savedFits, setSavedFits] = useState<any[]>([]);

  // =========================================================================
  // 4. USE-EFFECT HOOKS
  // =========================================================================
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const data = await res.json();
            if (data.current_weather) {
              const temp = Math.round(data.current_weather.temperature);
              setWeatherText(`${temp}°C • Live Local`);
            }
          } catch (e) {
            console.log("Weather fetch skipped");
          }
        },
        () => console.log("Location permission skipped")
      );
    }

    const savedDna = localStorage.getItem("stylo_user_dna");
    if (savedDna) {
      try {
        const parsed = JSON.parse(savedDna);
        if (parsed.skinTone) setSkinTone(parsed.skinTone);
        if (parsed.height) setHeight(parsed.height);
        if (parsed.bodyBuild) setBodyBuild(parsed.bodyBuild);
        if (parsed.preferredStyle) setPreferredStyle(parsed.preferredStyle);
        if (parsed.language) setLanguage(parsed.language);
      } catch (e) {
        console.error("DNA Load Failed", e);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setHistoryFits([]);
        setSavedFits([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 750);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSaveDna = () => {
    const dnaData = { skinTone, height, bodyBuild, preferredStyle, language };
    localStorage.setItem("stylo_user_dna", JSON.stringify(dnaData));
    setShowDnaModal(false);
  };

  const toggleLanguage = (newLang: "English" | "Hinglish" | "Hindi") => {
    setLanguage(newLang);
    const savedDna = localStorage.getItem("stylo_user_dna");
    const currentData = savedDna ? JSON.parse(savedDna) : {};
    localStorage.setItem("stylo_user_dna", JSON.stringify({ ...currentData, language: newLang }));
  };

  // =========================================================================
  // 5. DATABASE OPERATIONS
  // =========================================================================
  const fetchUserData = async (userId: string) => {
    try {
      const { data: historyData } = await supabase
        .from("outfit_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (historyData) setHistoryFits(historyData);

      const { data: savedData } = await supabase
        .from("saved_fits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (savedData) setSavedFits(savedData);
    } catch (err) {
      console.error("Database fetch error:", err);
    }
  };

  const autoSaveToHistory = async (fitData: any, imgUrl: string | null) => {
    if (!user) return;
    try {
      const newEntry = {
        user_id: user.id,
        occasion: selectedOccasion,
        vibe: fitData.vibe,
        fit_score: fitData.fitScore,
        top: fitData.top,
        bottom: fitData.bottom,
        footwear: fitData.footwear,
        palette: fitData.palette,
        styling_tip: fitData.stylingTip,
        image_url: imgUrl,
      };

      const { data, error } = await supabase
        .from("outfit_history")
        .insert([newEntry])
        .select();

      if (!error && data) {
        setHistoryFits((prev) => [data[0], ...prev]);
      }
    } catch (err) {
      console.error("History autosave error:", err);
    }
  };

  const handleSaveFit = async () => {
    if (!currentFit) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const newSavedEntry = {
        user_id: user.id,
        occasion: selectedOccasion,
        vibe: currentFit.vibe,
        fit_score: currentFit.fitScore,
        top: currentFit.top,
        bottom: currentFit.bottom,
        footwear: currentFit.footwear,
        palette: currentFit.palette,
        styling_tip: currentFit.stylingTip,
        image_url: imagePreview,
      };

      const { data, error } = await supabase
        .from("saved_fits")
        .insert([newSavedEntry])
        .select();

      if (!error && data) {
        setSavedFits((prev) => [data[0], ...prev]);
      }
    } catch (err) {
      console.error("Save fit error:", err);
    }
  };

  const handleDeleteSavedFit = async (id: string) => {
    try {
      await supabase.from("saved_fits").delete().eq("id", id);
      setSavedFits((prev) => prev.filter((fit) => fit.id !== id));
    } catch (err) {
      console.error("Delete fit error:", err);
    }
  };

  const handleDeleteHistoryFit = async (id: string) => {
    try {
      await supabase.from("outfit_history").delete().eq("id", id);
      setHistoryFits((prev) => prev.filter((fit) => fit.id !== id));
    } catch (err) {
      console.error("Delete history error:", err);
    }
  };

  const handleDeleteAllUserData = async () => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to permanently delete all your scanned and saved fits?");
    if (!confirmDelete) return;

    try {
      await supabase.from("outfit_history").delete().eq("user_id", user.id);
      await supabase.from("saved_fits").delete().eq("user_id", user.id);
      setHistoryFits([]);
      setSavedFits([]);
      setShowPrivacyModal(false);
      alert("All cloud data deleted successfully.");
    } catch (err) {
      alert("Data deletion error");
    }
  };

  // =========================================================================
  // 6. AUTH HANDLERS: EMAIL + DIRECT GOOGLE ACCOUNT CHOOSER POPUP
  // =========================================================================
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "Google sign in failed");
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          setShowAuthModal(false);
          setActiveTab("stylist");
          router.refresh();
        } else {
          setAuthError(language === "Hindi" ? "खाता बन गया! अब लॉग इन करें।" : "Account created! Please log in.");
          setAuthMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setShowAuthModal(false);
        setActiveTab("stylist");
        router.refresh();
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab("stylist");
  };

  // =========================================================================
  // 7. EXPORT AESTHETIC STORY CARD
  // =========================================================================
  const handleDownloadStoryCard = () => {
    if (!currentFit || !imagePreview) return;
    setDownloadingCard(true);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, "#0c0a09");
    bgGrad.addColorStop(0.5, "#18181b");
    bgGrad.addColorStop(1, "#09090b");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagePreview;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(80, 180, 920, 900, 40);
      ctx.clip();
      
      const aspect = img.width / img.height;
      let drawW = 920;
      let drawH = 920 / aspect;
      if (drawH < 900) {
        drawH = 900;
        drawW = 900 * aspect;
      }
      ctx.drawImage(img, 80 + (920 - drawW) / 2, 180 + (900 - drawH) / 2, drawW, drawH);
      ctx.restore();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(80, 180, 920, 900, 40);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px sans-serif";
      ctx.fillText("STYLO AI", 80, 120);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("COUTURE INTELLIGENCE", 80, 150);

      ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
      ctx.beginPath();
      ctx.roundRect(780, 80, 220, 65, 30);
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(`★ ${currentFit.fitScore}/10`, 820, 125);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "900 42px sans-serif";
      ctx.fillText(currentFit.vibe.toUpperCase(), 80, 1150);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("TOP:", 80, 1220);
      ctx.fillStyle = "#f4f4f5";
      ctx.font = "28px sans-serif";
      ctx.fillText(currentFit.top.slice(0, 52), 170, 1220);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("BOTTOM:", 80, 1280);
      ctx.fillStyle = "#f4f4f5";
      ctx.font = "28px sans-serif";
      ctx.fillText(currentFit.bottom.slice(0, 48), 220, 1280);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("SHOES:", 80, 1340);
      ctx.fillStyle = "#f4f4f5";
      ctx.font = "28px sans-serif";
      ctx.fillText(currentFit.footwear.slice(0, 48), 195, 1340);

      if (currentFit.palette) {
        ctx.fillStyle = "#71717a";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("PALETTE", 80, 1430);

        currentFit.palette.forEach((col: string, i: number) => {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(240 + i * 70, 1422, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 3;
          ctx.stroke();
        });
      }

      ctx.fillStyle = "rgba(24, 24, 27, 0.9)";
      ctx.beginPath();
      ctx.roundRect(80, 1510, 920, 220, 32);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("STYLIST PRO-TIP", 120, 1565);

      ctx.fillStyle = "#e4e4e7";
      ctx.font = "28px sans-serif";
      const tipWords = currentFit.stylingTip.split(" ");
      let line = "";
      let y = 1620;
      for (let n = 0; n < tipWords.length; n++) {
        const testLine = line + tipWords[n] + " ";
        if (ctx.measureText(testLine).width > 840 && n > 0) {
          ctx.fillText(line, 120, y);
          line = tipWords[n] + " ";
          y += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 120, y);

      ctx.fillStyle = "#71717a";
      ctx.font = "20px sans-serif";
      ctx.fillText("Styled by Stylo AI • Personal Fashion Intelligence", 320, 1850);

      const link = document.createElement("a");
      link.download = `Stylo-${currentFit.vibe.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloadingCard(false);
    };
  };

  // =========================================================================
  // 8. UTILITIES & COMPRESSION
  // =========================================================================
  const currentFit = recommendations && recommendations.length > 0 
    ? (recommendations[selectedOptionIndex] || recommendations[0])
    : null;

  const isCurrentFitSaved = currentFit
    ? savedFits.some((fit) => fit.top === currentFit.top && fit.vibe === currentFit.vibe)
    : false;

  const handleShareFit = async () => {
    if (!currentFit) return;
    const shareText = `✨ Stylo Look (${currentFit.vibe}) ✨\n\n⭐ Score: ${currentFit.fitScore}/10\n👕 Top: ${currentFit.top}\n👖 Bottom: ${currentFit.bottom}\n👟 Shoes: ${currentFit.footwear}\n\n💡 Tip: ${currentFit.stylingTip}\n\nStyled with Stylo AI`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "My Stylo Outfit", text: shareText });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShopItem = (itemText: string) => {
    const query = encodeURIComponent(itemText + " for men");
    window.open(`https://www.google.com/search?tbm=shop&q=${query}`, "_blank");
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 480;
        const scaleSize = MAX_WIDTH / img.width;
        
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressed = new File([blob], "upload.jpg", { type: "image/jpeg" });
            resolve(compressed);
          } else {
            resolve(file);
          }
        }, "image/jpeg", 0.6);
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      setSelectedFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      setErrorMsg(null);
    }
  };

  const handleGetStyle = async () => {
    if (!selectedFile) {
      setErrorMsg(t.uploadAlert);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setRecommendations(null);
    setSelectedOptionIndex(0);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("occasion", selectedOccasion);
      formData.append("weather", weatherText);
      formData.append("language", language);
      formData.append("skinTone", skinTone);
      formData.append("height", height);
      formData.append("bodyBuild", bodyBuild);
      formData.append("preferredStyle", preferredStyle);

      const res = await fetch("/api/style", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Styling failed");

      let optionsList = [];
      if (result.data?.options && Array.isArray(result.data.options)) {
        optionsList = result.data.options;
      } else if (Array.isArray(result.data)) {
        optionsList = result.data;
      } else if (result.data?.top) {
        optionsList = [result.data];
      } else {
        throw new Error("Invalid output received from AI");
      }

      setRecommendations(optionsList);

      if (optionsList.length > 0) {
        autoSaveToHistory(optionsList[0], imagePreview);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 9. UI RENDER
  // =========================================================================
  return (
    <main className="min-h-screen bg-[#0A0A0C] text-neutral-100 flex justify-center p-3 sm:p-5 selection:bg-rose-500 selection:text-white font-sans antialiased">
      <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/80 rounded-[32px] p-5 sm:p-6 flex flex-col gap-5 shadow-2xl my-auto relative overflow-hidden">
        
        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ================= APP HEADER ================= */}
        <header className="flex items-center justify-between relative z-10">
          <StyloLogo tagline={t.tagline} />
          
          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-950/90 border border-neutral-800 p-0.5 rounded-full">
              {languagesList.map((langItem) => (
                <button
                  key={langItem.id}
                  onClick={() => toggleLanguage(langItem.id as any)}
                  className={`text-[10px] px-2 py-1 rounded-full font-bold transition-all ${
                    language === langItem.id
                      ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-[11px] bg-neutral-950/80 hover:bg-rose-500/20 hover:text-rose-400 border border-neutral-800 px-2.5 py-1 rounded-full transition-all active:scale-95"
                title={t.logoutBtn}
              >
                <LogOut className="w-3 h-3" />
                <span className="max-w-[50px] truncate">{user.email?.split("@")[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold px-2.5 py-1 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md shadow-rose-500/20"
              >
                <User className="w-3 h-3" /> {t.loginBtn}
              </button>
            )}
          </div>
        </header>

        {/* ================= FLOATING NAVIGATION ================= */}
        <nav className="flex bg-neutral-950/80 border border-neutral-800/80 p-1.5 rounded-2xl relative z-10 shadow-inner">
          <button
            onClick={() => setActiveTab("stylist")}
            className={`flex-1 text-xs py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "stylist" 
                ? "bg-gradient-to-r from-neutral-800 to-neutral-800/90 text-white shadow-md shadow-black/40 scale-[1.02]" 
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t.stylistTab}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 text-xs py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "history" 
                ? "bg-gradient-to-r from-neutral-800 to-neutral-800/90 text-white shadow-md shadow-black/40 scale-[1.02]" 
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <History className="w-3.5 h-3.5 text-rose-400" /> {t.historyTab} {historyFits.length > 0 && `(${historyFits.length})`}
          </button>
          <button
            onClick={() => setActiveTab("closet")}
            className={`flex-1 text-xs py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "closet" 
                ? "bg-gradient-to-r from-neutral-800 to-neutral-800/90 text-white shadow-md shadow-black/40 scale-[1.02]" 
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> {t.closetTab} {savedFits.length > 0 && `(${savedFits.length})`}
          </button>
        </nav>

        {/* ================= TAB 1: STYLIST GENERATOR ================= */}
        {activeTab === "stylist" && (
          <>
            {/* Live Weather & Style DNA Banner */}
            <div 
              onClick={() => setShowDnaModal(true)}
              className="bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent border border-amber-500/20 hover:border-amber-500/40 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.99] group shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-md shadow-amber-500/20 group-hover:rotate-6 transition-transform">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {t.dnaBannerTitle}
                  </span>
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <CloudSun className="w-3 h-3 text-amber-400 inline" /> {weatherText} • {skinTone.split("/")[0]}
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-neutral-950 border border-neutral-800 text-amber-400 font-semibold px-2.5 py-1 rounded-xl group-hover:border-amber-500/40 transition-colors">
                {t.dnaBannerEdit}
              </span>
            </div>

            {/* Photo Upload / Capture Box */}
            <section className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-neutral-400" /> {t.uploadTitle}
              </label>

              {imagePreview ? (
                <div className="border border-neutral-800 rounded-[24px] relative overflow-hidden min-h-[160px] bg-neutral-950/60 flex items-center justify-center group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-44 object-cover rounded-[24px]"
                  />
                  {loading && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-[bounce_1.4s_infinite]" />
                  )}
                  <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg active:scale-95"
                    >
                      <Camera className="w-3 h-3 text-amber-400" /> {t.takePhotoBtn}
                    </button>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg active:scale-95"
                    >
                      <ImageIcon className="w-3 h-3 text-rose-400" /> {t.uploadGalleryBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="border border-neutral-800 hover:border-amber-500/50 bg-neutral-950/70 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-neutral-200">{t.takePhotoBtn}</span>
                    <span className="text-[9px] text-neutral-500">Live Click</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="border border-neutral-800 hover:border-rose-500/50 bg-neutral-950/70 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-neutral-200">{t.uploadGalleryBtn}</span>
                    <span className="text-[9px] text-neutral-500">From Photos</span>
                  </button>
                </div>
              )}
            </section>

            {/* Occasion Selection */}
            <section className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" /> {t.occasionTitle}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {t.occasions.map((occ, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOccasion(translations.English.occasions[idx])}
                    className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all active:scale-95 ${
                      selectedOccasion === translations.English.occasions[idx]
                        ? "bg-white text-black font-bold shadow-md shadow-white/10 scale-[1.02]"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </section>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-2xl">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleGetStyle}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-xs font-bold tracking-wide animate-pulse">
                    {t.loadingSteps[loadingStep]}
                  </span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">{t.generateBtn}</span>
                </>
              )}
            </button>

            {/* Recommendation Result Card */}
            {currentFit && !loading && (
              <section className="bg-neutral-950/90 border border-neutral-800 rounded-[28px] p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
                
                {recommendations && recommendations.length > 1 && (
                  <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-2xl border border-neutral-800">
                    <button
                      onClick={() => setSelectedOptionIndex(0)}
                      className={`text-xs py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        selectedOptionIndex === 0
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20"
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {t.optionClassic}
                    </button>
                    <button
                      onClick={() => setSelectedOptionIndex(1)}
                      className={`text-xs py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        selectedOptionIndex === 1
                          ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20"
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" /> {t.optionBold}
                    </button>
                  </div>
                )}

                {/* Score & Actions Header */}
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5 pt-1">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    {currentFit.vibe}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-400">
                        {currentFit.fitScore}/10
                      </span>
                    </div>

                    <button
                      onClick={handleShareFit}
                      className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-all active:scale-90"
                      title="Share Outfit"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={handleSaveFit}
                      className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-all active:scale-90"
                      title="Save to Closet"
                    >
                      {isCurrentFitSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Clothing Recommendations */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col pr-2">
                      <span className="text-neutral-500 font-bold text-[10px] uppercase tracking-wider">{t.topwear}</span>
                      <span className="text-neutral-200 font-medium">{currentFit.top}</span>
                    </div>
                    <button
                      onClick={() => handleShopItem(currentFit.top)}
                      className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-xl border border-neutral-800 shrink-0 active:scale-95 transition-all"
                    >
                      {t.shopBtn} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col pr-2">
                      <span className="text-neutral-500 font-bold text-[10px] uppercase tracking-wider">{t.bottomwear}</span>
                      <span className="text-neutral-200 font-medium">{currentFit.bottom}</span>
                    </div>
                    <button
                      onClick={() => handleShopItem(currentFit.bottom)}
                      className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-xl border border-neutral-800 shrink-0 active:scale-95 transition-all"
                    >
                      {t.shopBtn} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col pr-2">
                      <span className="text-neutral-500 font-bold text-[10px] uppercase tracking-wider">{t.footwear}</span>
                      <span className="text-neutral-200 font-medium">{currentFit.footwear}</span>
                    </div>
                    <button
                      onClick={() => handleShopItem(currentFit.footwear)}
                      className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-xl border border-neutral-800 shrink-0 active:scale-95 transition-all"
                    >
                      {t.shopBtn} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Swatches */}
                {currentFit.palette && (
                  <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-neutral-400">{t.paletteTitle}</span>
                    <div className="flex gap-2">
                      {currentFit.palette.map((color: string, i: number) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-neutral-700 shadow-md transform hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Styling Pro Tip Note */}
                <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-2xl text-[11px] text-neutral-300 leading-relaxed shadow-sm">
                  💡 <span className="font-bold text-amber-400">{t.stylistNote}</span> {currentFit.stylingTip}
                </div>

                {/* Download Story Card */}
                <button
                  onClick={handleDownloadStoryCard}
                  disabled={downloadingCard}
                  className="w-full mt-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                >
                  {downloadingCard ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{t.downloadCard}</span>
                </button>
              </section>
            )}

            {/* App Store Compliant Privacy Link */}
            <div className="text-center pt-2">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1 mx-auto"
              >
                <ShieldCheck className="w-3 h-3 text-amber-500/70" /> Privacy & App Policy
              </button>
            </div>
          </>
        )}

        {/* ================= TAB 2: HISTORY ================= */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-neutral-200 flex items-center gap-2 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-amber-400" /> {t.historyHeading}
            </h2>
            
            {!user ? (
              <div className="text-center py-10 text-neutral-400 text-xs flex flex-col items-center gap-3 bg-neutral-950/50 rounded-2xl border border-neutral-800/80 p-6">
                <p>{t.historyLoginPrompt}</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  {t.loginBtn}
                </button>
              </div>
            ) : historyFits.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 text-xs bg-neutral-950/40 rounded-2xl border border-neutral-800/60 p-6">
                {t.historyEmpty}
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                {historyFits.map((fit) => (
                  <div
                    key={fit.id}
                    className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-2xl flex flex-col gap-2 relative shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{fit.vibe}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md text-neutral-400 font-medium">{fit.occasion}</span>
                        <button
                          onClick={() => handleDeleteHistoryFit(fit.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 active:scale-90 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-300 space-y-1">
                      <p><span className="text-neutral-500">Top:</span> {fit.top}</p>
                      <p><span className="text-neutral-500">Bottom:</span> {fit.bottom}</p>
                      <p><span className="text-neutral-500">Shoes:</span> {fit.footwear}</p>
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1.5 border-t border-neutral-900 flex justify-between">
                      <span>{t.scannedOn} {new Date(fit.created_at).toLocaleDateString()}</span>
                      <span className="text-amber-400 font-semibold">⭐ {fit.fit_score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: CLOSET ================= */}
        {activeTab === "closet" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-neutral-200 flex items-center gap-2 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> {t.closetHeading}
            </h2>
            
            {!user ? (
              <div className="text-center py-10 text-neutral-400 text-xs flex flex-col items-center gap-3 bg-neutral-950/50 rounded-2xl border border-neutral-800/80 p-6">
                <p>{t.closetLoginPrompt}</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  {t.loginBtn}
                </button>
              </div>
            ) : savedFits.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 text-xs bg-neutral-950/40 rounded-2xl border border-neutral-800/60 p-6">
                {t.closetEmpty}
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                {savedFits.map((fit) => (
                  <div
                    key={fit.id}
                    className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-2xl flex flex-col gap-2 relative shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{fit.vibe}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md text-neutral-400 font-medium">{fit.occasion}</span>
                        <button
                          onClick={() => handleDeleteSavedFit(fit.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 active:scale-90 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-300 space-y-1">
                      <p><span className="text-neutral-500">Top:</span> {fit.top}</p>
                      <p><span className="text-neutral-500">Bottom:</span> {fit.bottom}</p>
                      <p><span className="text-neutral-500">Shoes:</span> {fit.footwear}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= PRIVACY MODAL ================= */}
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 flex flex-col gap-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> {t.privacyHeading}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {t.privacySub}
                </p>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-2xl text-[11px] text-neutral-400 space-y-1.5">
                <p>• Photos are processed via Google Gemini API in-memory.</p>
                <p>• Saved closets and history are secured using Row Level Security.</p>
                <p>• We never share or sell personal measurements or photos.</p>
              </div>

              {user && (
                <button
                  onClick={handleDeleteAllUserData}
                  className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> {t.deleteAccountBtn}
                </button>
              )}

            </div>
          </div>
        )}

        {/* ================= STYLE DNA & LANGUAGE MODAL ================= */}
        {showDnaModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 flex flex-col gap-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setShowDnaModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" /> {t.dnaModalTitle}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {t.dnaModalSub}
                </p>
              </div>

              <div className="flex flex-col gap-3.5 text-xs max-h-[360px] overflow-y-auto pr-1">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-neutral-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-amber-400" /> {t.langSection}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {languagesList.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLanguage(l.id as any)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          language === l.id 
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold shadow-sm" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div className="text-[11px]">{l.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-neutral-300">{t.skinSection}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {skinToneOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSkinTone(opt)}
                        className={`p-2 rounded-xl text-[11px] text-left border transition-all ${
                          skinTone === opt 
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-neutral-300">{t.heightSection}</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {heightOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setHeight(opt)}
                        className={`p-2 rounded-xl text-[10px] text-center border transition-all ${
                          height === opt 
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        {opt.split("(")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-neutral-300">{t.buildSection}</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {buildOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setBodyBuild(opt)}
                        className={`p-2 rounded-xl text-[10px] text-center border transition-all ${
                          bodyBuild === opt 
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        {opt.split("/")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-neutral-300">{t.styleSection}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {styleOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPreferredStyle(opt)}
                        className={`p-2 rounded-xl text-[11px] text-left border transition-all ${
                          preferredStyle === opt 
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveDna}
                className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-rose-500/20 active:scale-98 mt-1"
              >
                <CheckCircle2 className="w-4 h-4" /> {t.saveDnaBtn}
              </button>

            </div>
          </div>
        )}

        {/* ================= LOGIN / SIGN UP MODAL (WITH GOOGLE ONE-CLICK) ================= */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 flex flex-col gap-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-base font-black text-white">
                  {authMode === "login" ? t.authLoginTitle : t.authSignupTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {authMode === "login" ? t.authLoginSub : t.authSignupSub}
                </p>
              </div>

              {/* DIRECT GOOGLE ACCOUNT BUTTON */}
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                type="button"
                className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t.googleSignIn}</span>
              </button>

              {/* OR DIVIDER */}
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase font-semibold">
                <div className="h-[1px] bg-neutral-800 flex-1" />
                <span>{t.orDivider}</span>
                <div className="h-[1px] bg-neutral-800 flex-1" />
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> {t.passwordLabel}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {authError && (
                  <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-1 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 disabled:opacity-50 active:scale-98"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authMode === "login" ? (
                    t.signInAction
                  ) : (
                    t.signUpAction
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "signup" : "login");
                    setAuthError(null);
                  }}
                  className="text-xs text-neutral-400 hover:text-amber-400 font-medium"
                >
                  {authMode === "login" ? t.toggleToSignup : t.toggleToLogin}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}