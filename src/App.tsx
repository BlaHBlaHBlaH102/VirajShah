import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "motion/react";
import { 
  Rocket, 
  Code, 
  Users, 
  Award, 
  Briefcase, 
  Heart, 
  Camera, 
  Hammer, 
  Music, 
  ExternalLink, 
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  Cpu,
  Trophy,
  Globe,
  Zap,
  ArrowRight,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Calendar,
  User
} from "lucide-react";
import { Card, Section } from "./components/UI";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import Markdown from "react-markdown";

export default function App() {
  const [activeTab, setActiveTab] = useState("resume");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "shahviraj918@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsAuthLoading(false);
    });

    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    return () => {
      unsubscribe();
      unsubscribePosts();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (password === "Buggati918!") {
      try {
        // Using a dummy email for the admin login since we're using password-based "admin mode"
        // In a real app, we'd use proper auth, but here we'll simulate it with the provided password
        await signInWithEmailAndPassword(auth, "shahviraj918@gmail.com", password);
        setPassword("");
        setShowLogin(false);
      } catch (error: any) {
        setLoginError("Login failed. Please check your credentials.");
      }
    } else {
      setLoginError("Incorrect password.");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      await addDoc(collection(db, "posts"), {
        ...newPost,
        createdAt: serverTimestamp(),
        author: "Viraj Shah"
      });
      setNewPost({ title: "", content: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -100]);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 bg-slate-950">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-[100] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6">
        <div className="glass-dark px-2 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-white/10">
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab("resume")}
              className={`px-6 md:px-10 py-3 rounded-full text-sm font-light uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${activeTab === "resume" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              {activeTab === "resume" && (
                <motion.div 
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full -z-10"
                />
              )}
              Resume
            </button>
            <button 
              onClick={() => setActiveTab("hobbies")}
              className={`px-6 md:px-10 py-3 rounded-full text-sm font-light uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${activeTab === "hobbies" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              {activeTab === "hobbies" && (
                <motion.div 
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full -z-10"
                />
              )}
              Hobbies
            </button>
            <button 
              onClick={() => setActiveTab("blog")}
              className={`px-6 md:px-10 py-3 rounded-full text-sm font-light uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${activeTab === "blog" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              {activeTab === "blog" && (
                <motion.div 
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full -z-10"
                />
              )}
              Blog
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === "resume" ? (
          <motion.div
            key="resume"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
              <motion.div 
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="relative z-10 text-center w-full max-w-7xl"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-6 py-2 mb-12 rounded-full glass-dark text-blue-400 text-[11px] font-mono uppercase tracking-[0.6em] border-blue-500/30"
                >
                  Green Level High School • Class of 2028 • 6 AP Courses
                </motion.div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 mb-12">
                  <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-name text-white"
                  >
                    VIRAJ
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "backOut" }}
                    className="relative inline-block animate-float"
                  >
                    <div className="w-32 h-32 md:w-48 lg:w-64 md:h-48 lg:h-64 rounded-full border-8 border-blue-500/10 p-2 overflow-hidden mx-auto shadow-[0_0_100px_-15px_rgba(59,130,246,0.4)] bg-slate-900 relative z-10">
                      <img 
                        src="/headshot.JPG" 
                        alt="Viraj Shah" 
                        className="w-full h-full object-cover rounded-full transition-all duration-1000 grayscale hover:grayscale-0 scale-110 hover:scale-100"
                        onError={(e) => {
                          e.currentTarget.src = "https://ui-avatars.com/api/?name=Viraj+Shah&background=020617&color=3b82f6&size=400";
                        }}
                      />
                    </div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                      className="absolute -inset-6 border border-dashed border-blue-500/20 rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-2xl border-4 border-slate-950 z-20"
                    >
                      <Zap size={24} />
                    </motion.div>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-name text-gradient"
                  >
                    SHAH
                  </motion.h1>
                </div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-5xl text-slate-400 max-w-6xl mx-auto font-thin leading-[1.1] tracking-[-0.02em] mb-16"
                >
                  Pioneering <span className="text-slate-100 font-thin italic font-serif">Electrical Engineering</span> & <span className="text-slate-100 font-thin italic font-serif">Robotics</span> through community-driven innovation.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
                >
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <MapPin size={18} className="text-blue-500" /> Cary, NC
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <Mail size={18} className="text-blue-500" /> shahviraj918@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <Zap size={18} className="text-blue-500" /> (919) 240-3248
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <GraduationCap size={18} className="text-blue-500" /> GPA: 4.692 • Rank: 13/633
                  </div>
                </motion.div>
              </motion.div>

              {/* Background Elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
              </div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] uppercase tracking-[0.5em] font-light opacity-40">Scroll</span>
                <div className="w-px h-10 bg-gradient-to-b from-blue-500 to-transparent" />
              </motion.div>
            </section>

            {/* Mission Section */}
            <Section id="about" title="The Mission">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-8 glass p-8 md:p-16 lg:p-20 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] border-blue-500/10 relative overflow-hidden group"
                >
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition-colors duration-1000" />
                  <h3 className="text-4xl md:text-7xl font-thin mb-10 flex items-center gap-6 tracking-[-0.02em] uppercase">
                    <Zap className="text-blue-400" size={48} /> The Vision
                  </h3>
                  <p className="text-slate-400 leading-[1.1] text-3xl md:text-5xl font-thin tracking-[-0.02em]">
                    Motivated and curious high school student passionate about <span className="text-slate-100 font-thin italic font-serif">engineering, robotics, and community engagement</span>. Looking for collaborative opportunities to solve real-world engineering problems through <span className="text-blue-400 font-thin">Electrical Engineering, Innovation, and Patent Law</span>.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-4 glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] border-blue-500/10 bg-blue-500/5 flex flex-col justify-center"
                >
                  <h3 className="text-3xl md:text-5xl font-thin mb-8 flex items-center gap-4 tracking-[-0.02em] uppercase">
                    <Heart className="text-blue-400" size={32} /> Resilience
                  </h3>
                  <p className="text-slate-300 leading-tight italic text-2xl font-serif font-thin">
                    "Watching my father remain engaged despite Long Covid and my mother’s perseverance has deeply shaped my character. Their resilience inspires me to push forward."
                  </p>
                </motion.div>
              </div>
            </Section>

            {/* STEM Projects - Bento Layout */}
            <Section 
              id="stem" 
              title="Engineering" 
              subtitle="Architecting the future through hardware, software, and strategy."
            >
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
                <Card 
                  className="md:col-span-3 lg:col-span-8 h-full"
                  title="FIRST Robotics (FRC)"
                  subtitle="Mechanical & Drivetrain Lead"
                  description="THOR East 2025 Champion, Wake 2 2026 Champion, Pembroke 2026 with FRC 9032. Designed chassis and power systems under competition deadlines. Led prototyping challenges and outreach. Fundraised $1,000+."
                  icon={Cpu}
                  tags={["CAD", "Robotics", "Leadership"]}
                  date="2023 - 2026"
                />
                <Card 
                  className="md:col-span-3 lg:col-span-4 h-full"
                  title="Congressional App Challenge"
                  subtitle="District Winner (2nd Place)"
                  description="Developed D.I.N.G. – sustainability donation platform (4th District 2nd Place), HurriHelp (AI disaster relief), and NeuroGuard Drive (Seizure-detection driving safety system)."
                  icon={Code}
                  tags={["Python", "AI", "Mobile Dev"]}
                  date="2022 - 2024"
                />
                <Card 
                  className="md:col-span-3 lg:col-span-4 h-full"
                  title="Enhanci"
                  subtitle="AI Accessibility Tool"
                  description="AI-powered accessibility tool for web developers. Lead Developer. Built with React, Tailwind, and Gemini API. Winner of Hackathon."
                  icon={Globe}
                  tags={["AI", "React", "Accessibility"]}
                  date="2024"
                />
                <Card 
                  className="md:col-span-3 lg:col-span-4 h-full"
                  title="FormaldeGone"
                  subtitle="Hand-held Formaldehyde Detector"
                  description="Developed a hand-held formaldehyde detector system for research."
                  icon={Rocket}
                  tags={["Engineering", "Research", "Hardware"]}
                  date="2024 - 2026"
                  link="https://docs.google.com/document/d/1Soy0RGT-rB3AG1HuGOz7kfW-OwwXf_bqYWWIe5qdspQ/edit?usp=sharing"
                  linkText="Read Research Paper"
                />
                <Card 
                  className="md:col-span-3 lg:col-span-4 h-full"
                  title="Elite Build Labs"
                  subtitle="Founder & Entrepreneur"
                  description="Founded custom PC manufacturing business with 50+ clients. Nexus Sports Photography founder capturing pro photos for local athletes."
                  icon={Zap}
                  tags={["Hardware", "Business", "Sales"]}
                  date="2023 - Present"
                />
                <Card 
                  className="md:col-span-6 lg:col-span-4 h-full"
                  title="PrePaze Academy"
                  subtitle="Curriculum Developer"
                  description="Built robotics, AI, and PC-building curriculum. Taught 50+ instructional hours to 100+ students."
                  icon={Briefcase}
                  tags={["Education", "STEM", "Mentorship"]}
                  date="2024"
                />
              </div>
            </Section>

            {/* Leadership Section */}
            <Section 
              id="leadership" 
              title="Leadership & Community" 
              subtitle="Empowering communities and leading the next generation of scouts."
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="glass p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] border-blue-500/30 relative overflow-hidden group bg-gradient-to-br from-blue-600/10 to-transparent h-full"
                >
                  <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                    <Globe size={300} />
                  </div>
                  <h3 className="text-5xl md:text-7xl font-thin mb-6 tracking-[-0.02em] text-slate-100 uppercase">Click With Confidence</h3>
                  <p className="text-blue-400/80 font-mono text-xs mb-8 uppercase tracking-[0.6em] font-light">Founder & President • 501(a) Nonprofit</p>
                  <p className="text-slate-400 mb-12 text-2xl leading-tight font-thin tracking-[-0.01em]">
                    Addressing elder scam awareness through workshops and digital resources. Reached 2,000+ seniors across 50+ presentations.
                  </p>
                  <div className="flex flex-wrap gap-8 mb-12">
                    <div className="border border-slate-800 px-8 py-6 rounded-[2rem]">
                      <div className="text-6xl font-thin text-white tracking-tighter">2,000+</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-light mt-2">Volunteer Hours</div>
                    </div>
                    <div className="border border-slate-800 px-8 py-6 rounded-[2rem]">
                      <div className="text-6xl font-thin text-white tracking-tighter">50+</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-light mt-2">Presentations</div>
                    </div>
                  </div>
                  <a 
                    href="https://clickwithconfidence.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary px-12 py-6 text-sm"
                  >
                    Explore clickwithconfidence.org <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </a>
                </motion.div>

                <div className="flex flex-col gap-8">
                  <Card 
                    title="Student Council"
                    subtitle="Class Representative"
                    description="Raised $3,500+ for No Kid Hungry. Organized schoolwide initiatives including Gator Gala, Talent Show, and Artist Alley."
                    icon={Heart}
                    date="2024 - Present"
                  />
                  <Card 
                    title="TED-Ed Student Talks"
                    subtitle="Speaker & Leader"
                    description="Delivered and coordinated student-led presentations on innovation and leadership. Fostering a culture of public speaking and idea sharing."
                    icon={Globe}
                    date="2023 - 2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-32 relative z-10">
                <Card 
                  className="h-full"
                  title="FBLA"
                  subtitle="Future Business Leaders of America"
                  description="3rd place at States (SLC), NLC Qualifier Nomination. Leading initiatives in business and technology competition."
                  icon={Trophy}
                  date="2024 - Present"
                />
                <Card 
                  className="h-full"
                  title="T216 ASPL"
                  subtitle="Assistant Senior Patrol Leader"
                  description="Managing daily troop operations for over 300 scouts while coordinating trip referendums, attendance metrics, and leadership presentations."
                  icon={Users}
                  date="10th Grade (Current)"
                />
                <Card 
                  className="h-full"
                  title="T216 Troop Guide"
                  subtitle="Mentor for Younger Scouts"
                  description="Mentored 14 younger scouts through advancement, skill development, and leadership growth within the troop on their journey towards Eagle."
                  icon={Users}
                  date="10th Grade"
                />
                <Card 
                  className="h-full"
                  title="T216 Summer Camp SPL"
                  subtitle="Senior Patrol Leader"
                  description="Organized operations, logistics, and morale to earn Honor Troop Distinction for 200+ scouts at Durant Occoneechee Scout Reservation."
                  icon={Users}
                  date="9th - 10th"
                />
                <Card 
                  className="h-full"
                  title="T216 ASPL Darlington"
                  subtitle="Assistant Senior Patrol Leader"
                  description="Coordinated camp activities and racer meet-and-greets for 100+ scouts at Darlington Raceway’s Scout Week."
                  icon={Users}
                  date="9th Grade"
                />
                <Card 
                  className="h-full"
                  title="Patrol Leader"
                  subtitle="Flaming Hot Cheetos Patrol"
                  description="Voiced needs and concerns of 9 scouts on their way to Eagle rank to senior leadership and coordinated events."
                  icon={Users}
                  date="9th Grade"
                />
                <Card 
                  className="h-full"
                  title="FLL Jr. Mentor"
                  subtitle="Robotics Mentor"
                  description="Guided 22 students through robot construction, coding, and research helping multiple teams achieve award-winning seasons."
                  icon={Cpu}
                  date="7th - 8th"
                />
                <Card 
                  className="h-full"
                  title="Court of Honor MC"
                  subtitle="Master of Ceremonies"
                  description="Led formal recognition ceremony for 120+ scouts, delivered opening and closing remarks."
                  icon={Users}
                  date="9th Grade"
                />
              </div>
            </Section>

            {/* Skills & Honors */}
            <Section id="skills" title="Technical Expertise">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-12">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.8em] text-slate-500 font-light mb-12 flex items-center gap-4">
                    <div className="w-12 h-px bg-slate-800" /> Technical Arsenal
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "Python", "Robotics CAD", "Prototyping", "Engineering Design", 
                      "Public Speaking", "Marketing", "Media", "STEM Instruction", 
                      "Project Management", "Adobe Illustrator", "Photoshop", "MS Excel",
                      "C++", "Circuit Design", "3D Printing", "Strategic Planning"
                    ].map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className="px-8 py-4 rounded-full border border-slate-800 text-slate-400 font-light text-sm hover:text-white hover:border-blue-500/30 transition-all cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-12">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.8em] text-slate-500 font-light mb-12 flex items-center gap-4">
                    <div className="w-12 h-px bg-slate-800" /> Distinguished Honors
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: "PSAT Score", val: "1480" },
                      { label: "PreACT Score", val: "33" },
                      { label: "AP Precalculus", val: "5" },
                      { label: "AP World History", val: "5" },
                      { label: "AoPS Pathway Scholar", val: "~$9,000" },
                      { label: "Cary Diwali Essay", val: "1st Place" }
                    ].map((honor, i) => (
                      <motion.div
                        key={honor.label}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2rem] flex justify-between items-center border border-slate-800 group hover:border-blue-500/20 transition-all"
                      >
                        <span className="text-slate-400 font-light text-lg group-hover:text-slate-200 transition-colors">{honor.label}</span>
                        <span className="text-white font-thin text-3xl tracking-tighter">{honor.val}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Footer */}
            <footer className="py-24 px-6 border-t border-white/5 text-center relative overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-600/5 to-transparent" />
              <div className="flex justify-center gap-10 mb-12">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-all hover:scale-110"><Linkedin size={28} /></a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-all hover:scale-110"><Github size={28} /></a>
                <a href="mailto:shahviraj918@gmail.com" className="text-slate-500 hover:text-blue-400 transition-all hover:scale-110"><Mail size={28} /></a>
              </div>
              <p className="text-slate-600 text-sm font-mono uppercase tracking-[1em] font-thin mb-12">VIRAJ SHAH • MMXXVI</p>
              
              <div className="flex justify-center">
                {!isAdmin ? (
                  <button 
                    onClick={() => setShowLogin(!showLogin)}
                    className="flex items-center gap-2 text-[10px] text-slate-700 uppercase tracking-[0.4em] hover:text-blue-500 transition-all group"
                  >
                    <Lock size={12} className="group-hover:scale-110 transition-transform" /> Admin Access
                  </button>
                ) : (
                  <button 
                    onClick={() => signOut(auth)}
                    className="flex items-center gap-2 text-[10px] text-blue-500 uppercase tracking-[0.4em] hover:text-blue-400 transition-all group"
                  >
                    <Unlock size={12} className="group-hover:scale-110 transition-transform" /> Logout Admin
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showLogin && !isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 max-w-xs mx-auto"
                  >
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                      <input 
                        type="password" 
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-900/50 border border-slate-800 rounded-full px-6 py-3 text-white text-center text-sm focus:outline-none focus:border-blue-500 transition-all"
                      />
                      {loginError && <p className="text-red-500 text-[10px] uppercase tracking-widest">{loginError}</p>}
                      <button type="submit" className="btn-primary py-3 justify-center">Login</button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </footer>
          </motion.div>
        ) : activeTab === "blog" ? (
          <motion.div
            key="blog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 max-w-7xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-thin-huge text-white tracking-[-0.04em] text-center mb-16 md:mb-32 leading-[0.8] uppercase"
            >
              THOUGHTS & <br className="md:hidden" /> <span className="text-gradient">INSIGHTS</span>
            </motion.h1>

            {isAdmin && (
              <div className="mb-16 flex justify-center">
                {!isCreating ? (
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="btn-primary"
                  >
                    <Plus size={18} /> Create New Post
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-[2rem] w-full max-w-3xl border-blue-500/30"
                  >
                    <h3 className="text-2xl font-thin text-white mb-6 uppercase tracking-widest">New Blog Post</h3>
                    <form onSubmit={handleCreatePost} className="space-y-6">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Post Title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-light"
                          required
                        />
                      </div>
                      <div>
                        <textarea 
                          placeholder="Post Content (Markdown supported)"
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-light h-64 resize-none"
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <button type="submit" className="btn-primary">Publish Post</button>
                        <button 
                          type="button" 
                          onClick={() => setIsCreating(false)}
                          className="px-8 py-4 rounded-full border border-slate-800 text-slate-400 text-xs uppercase tracking-widest hover:bg-slate-900 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            )}

            {isAuthLoading && (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}

            <div className="grid grid-cols-1 gap-12">
              {posts.length > 0 ? (
                posts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] border-blue-500/10 relative overflow-hidden group"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                      <div>
                        <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
                          <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {post.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
                          <span className="flex items-center gap-2"><User size={14} className="text-blue-500" /> {post.author}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-thin text-white tracking-tight leading-none uppercase">{post.title}</h2>
                      </div>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                    <div className="prose prose-invert prose-slate max-w-none prose-lg md:prose-xl">
                      <div className="text-slate-400 font-light">
                        <Markdown>{post.content}</Markdown>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 font-mono text-sm uppercase tracking-[0.5em]">No posts yet. Stay tuned!</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hobbies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 max-w-7xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-thin-huge text-white tracking-[-0.04em] text-center mb-16 md:mb-32 leading-[0.8] uppercase"
            >
              PASSIONS & <br className="md:hidden" /> <span className="text-gradient">PURSUITS</span>
            </motion.h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-8"
              >
                <div className="glass p-8 md:p-16 lg:p-20 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] border-blue-500/20 relative overflow-hidden group h-full">
                  <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                    <Camera size={300} />
                  </div>
                  <div className="flex items-center gap-8 mb-12">
                    <div className="p-6 rounded-[2rem] bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                      <Camera size={48} />
                    </div>
                    <h2 className="card-title">Photography</h2>
                  </div>
                  <p className="text-[clamp(1.25rem,3.5vw,1.75rem)] md:text-[clamp(1.5rem,4.5vw,2.5rem)] leading-[1.1] mb-16 font-thin tracking-[-0.02em] text-slate-400">
                    "Since I was seven or eight, I would go out into my backyard and take photos of all my LEGO sets."
                  </p>
                  <div className="space-y-10">
                    <h4 className="font-light text-slate-500 uppercase tracking-[0.6em] text-[11px]">Global Expeditions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        "Serengeti",
                        "Tarangire",
                        "Ngorongoro"
                      ].map(loc => (
                        <div key={loc} className="flex flex-col gap-4 text-slate-400 border border-slate-800 p-8 rounded-[2rem] hover:border-blue-500/20 transition-all">
                          <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                          <span className="font-thin text-2xl tracking-tighter uppercase">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-16 p-10 glass-dark bg-blue-500/5 rounded-[3rem] border-blue-500/10">
                    <p className="text-xl text-slate-300 italic font-serif">Founder of Nexus Sports Photography • Capturing professional action for local athletes.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 space-y-8"
              >
                <div className="glass p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] h-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-5 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                      <Music size={32} />
                    </div>
                    <h2 className="card-title">Piano</h2>
                  </div>
                  <p className="text-[clamp(1.25rem,3vw,1.75rem)] md:text-[clamp(1.5rem,4vw,2rem)] leading-tight font-thin tracking-[-0.01em] text-slate-400">
                    Performance is a cornerstone of my creative expression, featured in Guild Notes Magazine.
                  </p>
                </div>

                <div className="glass p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] h-1/2 flex flex-col justify-center border-indigo-500/20 relative overflow-hidden group">
                  <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                    <Hammer size={200} />
                  </div>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-5 rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                      <Hammer size={32} />
                    </div>
                    <h2 className="card-title">Woodworking</h2>
                  </div>
                  <p className="text-[clamp(1.25rem,3vw,1.75rem)] md:text-[clamp(1.5rem,4vw,2rem)] leading-tight font-thin tracking-[-0.01em] text-slate-400">
                    "I can take boring planks of wood and turn them into something dynamic, expressive, and useful."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Photography Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 1, title: "Serengeti Dusk", loc: "Tanzania" },
                { id: 2, title: "Crater Life", loc: "Ngorongoro" },
                { id: 3, title: "Tarangire Giants", loc: "Tarangire" },
                { id: 4, title: "Nexus Sports", loc: "Action" },
                { id: 5, title: "Woodturning", loc: "Studio" },
                { id: 6, title: "Piano Guild", loc: "Performance" }
              ].map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="aspect-[4/5] rounded-[3rem] overflow-hidden glass relative group cursor-pointer flex items-center justify-center p-12 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <h4 className="text-white text-3xl font-thin tracking-tighter mb-4">{item.title}</h4>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] font-light">{item.loc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
