import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSlider from '../components/HeroSlider.tsx';
import LogoSection from '../components/LogoSection.tsx';
import MagneticButton from '../components/ui/MagneticButton.tsx';
import { useJCS } from '../services/JCSContext';
import PartnerModal from '../components/PartnerModal';
import {
    ArrowRight, Globe, Target, Calendar,
    Leaf, Users, Lightbulb, X,
    Mic, Trophy, Zap, Layout, Recycle, Instagram, Linkedin, Mail, ArrowUp,
    Wallet, Wheat, HeartPulse, GraduationCap, Droplets, TrendingUp, Factory, Scale, Building2, Fish, TreePine, Gavel, Handshake, Check, ChevronDown
} from 'lucide-react';

const MainPage = () => {
    const navigate = useNavigate();
    const [selectedSDG, setSelectedSDG] = useState<any>(null);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleDashboardClick = () => {
        setIsConnecting(true);
        setTimeout(() => {
            navigate('/dashboard');
            // Reset state after navigation (though component might unmount)
            setTimeout(() => setIsConnecting(false), 500);
        }, 2000);
    };

    // Handle scroll for navbar styling
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const float = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // SDG Data with Details
    const sdgs = [
        { id: 1, title: "No Poverty", color: "bg-red-500", icon: Wallet, desc: "Eradicating poverty in all its forms remains one of the greatest challenges facing humanity. We focus on aid and resource mobilization.", details: "Our target is to ensure significant mobilization of resources from a variety of sources. We aim to implement social protection systems and ensure equal rights to economic resources, basic services, and technology for the vulnerable." },
        { id: 2, title: "Zero Hunger", color: "bg-yellow-500", icon: Wheat, desc: "Seeking sustainable solutions to end hunger in all its forms by 2030 and to achieve food security.", details: "The goal includes ending malnutrition, doubling agricultural productivity, and ensuring sustainable food production systems. We support local drives to feed the needy and educate on nutritional standards." },
        { id: 3, title: "Good Health", color: "bg-green-500", icon: HeartPulse, desc: "Ensuring healthy lives and promoting well-being for all at all ages is essential to sustainable development.", details: "We focus on efficient health financing and recruitment, development, training and retention of the health workforce. Our goal is to reduce maternal mortality, end preventable deaths of newborns, and fight communicable diseases." },
        { id: 4, title: "Quality Education", color: "bg-red-600", icon: GraduationCap, desc: "Obtaining a quality education is the foundation to improving people’s lives and sustainable development.", details: "We ensure inclusive and equitable quality education and promote lifelong learning opportunities for all. This includes equal access to affordable vocational training and eliminating gender disparities in education." },
        { id: 5, title: "Gender Equality", color: "bg-orange-500", icon: Users, desc: "Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous world.", details: "We work to end all forms of discrimination against all women and girls everywhere. This involves eliminating violence, harmful practices like child marriage, and ensuring full participation in leadership and decision-making." },
        { id: 6, title: "Clean Water", color: "bg-cyan-500", icon: Droplets, desc: "Clean, accessible water for all is an essential part of the world we want to live in.", details: "We aim to ensure availability and sustainable management of water and sanitation for all. This includes achieving universal and equitable access to safe and affordable drinking water and adequate sanitation/hygiene." },
        { id: 7, title: "Clean Energy", color: "bg-yellow-400", icon: Zap, desc: "Energy is central to nearly every major challenge and opportunity the world faces today.", details: "Our mission is to ensure access to affordable, reliable, sustainable and modern energy for all. We promote investment in energy infrastructure and clean energy technology." },
        { id: 8, title: "Decent Work", color: "bg-red-700", icon: TrendingUp, desc: "Sustainable economic growth will require societies to create the conditions that allow people to have quality jobs.", details: "We promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all. We support entrepreneurship, creativity and innovation." },
        { id: 9, title: "Innovation", color: "bg-orange-600", icon: Factory, desc: "Investments in infrastructure are crucial to achieving sustainable development.", details: "Our focus is to build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation. We support domestic technology development, research and innovation in developing countries." },
        { id: 10, title: "Reduced Inequalities", color: "bg-pink-500", icon: Scale, desc: "To reduce inequalities, policies should be universal in principle, paying attention to the needs of disadvantaged populations.", details: "We aim to reduce inequality within and among countries. This involves empowering and promoting the social, economic and political inclusion of all, irrespective of age, sex, disability, race, ethnicity, origin, religion or economic status." },
        { id: 11, title: "Sustainable Cities", color: "bg-orange-400", icon: Building2, desc: "There is a need to make cities safe, inclusive, resilient and sustainable for all humanity.", details: "We work to make cities and human settlements inclusive, safe, resilient and sustainable. This includes ensuring access to safe and affordable housing, basic services, and sustainable transport systems." },
        { id: 12, title: "Consumption", color: "bg-yellow-600", icon: Recycle, desc: "Sustainable consumption and production is about promoting resource and energy efficiency.", details: "We ensure sustainable consumption and production patterns. Our goals include substantially reducing waste generation through prevention, reduction, recycling and reuse." },
        { id: 13, title: "Climate Action", color: "bg-green-700", icon: Globe, desc: "Climate change is a global challenge that does not respect national borders.", details: "We take urgent action to combat climate change and its impacts. This involves strengthening resilience to climate-related hazards and integrating climate change measures into policies, strategies and planning." },
        { id: 14, title: "Life Below Water", color: "bg-blue-500", icon: Fish, desc: "Our oceans drive global systems that make the Earth habitable for humankind.", details: "We conserve and sustainably use the oceans, seas and marine resources. We aim to prevent and significantly reduce marine pollution of all kinds and addressing ocean acidification." },
        { id: 15, title: "Life on Land", color: "bg-green-600", icon: TreePine, desc: "Deforestation and desertification are major challenges to sustainable development.", details: "We protect, restore and promote sustainable use of terrestrial ecosystems. We combat desertification, halt and reverse land degradation and halt biodiversity loss." },
        { id: 16, title: "Peace & Justice", color: "bg-blue-700", icon: Gavel, desc: "Peace, stability, human rights and effective governance are important pathways for development.", details: "We promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels." },
        { id: 17, title: "Partnerships", color: "bg-blue-900", icon: Handshake, desc: "The SDGs can only be realized with strong global partnerships and cooperation.", details: "We strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development. This includes enhancing global macroeconomic stability and policy coordination." },
    ];

    // --- Stats Logic for Floating Dock ---
    const { events, departments } = useJCS();
    const totalEvents = events.length;
    const topPerformer = [...departments].sort((a, b) => b.totalCredits - a.totalCredits)[0];

    return (
        <div className="bg-[#FAFAFA] text-[#292929] font-sans selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden relative">

            {/* FLOATING STATS DOCK - RIGHT SIDE (Desktop Only) */}
            {/* FLOATING STATS DOCK - RIGHT SIDE (Desktop Only) */}
            <motion.div
                initial={{ x: 100, y: "-50%", opacity: 0 }}
                animate={{ x: 0, y: "-50%", opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, type: "spring" }}
                className="fixed right-0 top-1/2 z-40 hidden 2xl:flex flex-col gap-4"
            >
                {/* Red Themed Slim Container */}
                <div className="bg-[#DE1819]/90 backdrop-blur-xl border-l border-white/20 p-4 rounded-l-2xl shadow-xl shadow-red-900/30 flex flex-col gap-5 w-36 relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[30px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/20 blur-[20px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                    {/* Live Indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-60">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                    </div>

                    {/* Stat 1: Total Events (Clickable) */}
                    <motion.div
                        whileHover={{ scale: 1.05, x: -5 }}
                        className="cursor-pointer"
                        onClick={() => navigate('/gallery')}
                    >
                        <div className="flex items-center gap-1.5 mb-1 text-red-100">
                            <Calendar size={12} className="opacity-80" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Events</span>
                        </div>
                        <div className="text-2xl font-serif font-bold text-white ml-0.5 leading-none transition-colors group-hover:text-white/90">{totalEvents}</div>
                    </motion.div>

                    <div className="h-[1px] bg-white/20 w-full"></div>

                    {/* Stat 2: Top Performer (Clickable) */}
                    <motion.div
                        whileHover={{ scale: 1.05, x: -5 }}
                        className="cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="flex items-center gap-1.5 mb-1 text-red-100">
                            <Trophy size={12} className="opacity-80" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Top Dept</span>
                        </div>
                        <div className="ml-0.5">
                            <div className="text-sm font-bold text-white truncate w-full" title={topPerformer?.name || 'N/A'}>
                                {topPerformer?.code || 'N/A'}
                            </div>
                            <div className="text-[10px] text-red-200/80 font-medium mt-0.5">{topPerformer?.totalCredits || 0} Pts</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Navbar - Academic Header Style */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-100 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'}`}>
                <div className="w-full px-6 md:px-12 lg:px-24 flex justify-between items-center relative">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="leading-tight text-slate-900">
                            <div className="font-serif font-bold text-2xl tracking-tight">JECRC Center for SDG's</div>
                            <div className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#DE1819]">Center for Sustainable Development Goals</div>
                        </div>
                    </div>
                    {/* Centered Dual Logo - Hidden on smaller screens to prevent overlap */}
                    <div className="hidden 2xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-5" onClick={() => navigate('/')}>
                        <img
                            src="/images/jecrc_university_logo.jpg"
                            alt="JECRC University"
                            className="h-14 object-contain"
                        />
                        <div className="h-10 w-[2px] bg-black/80 rounded-full"></div>
                        <img
                            src="/images/jcs_logo_header.png"
                            alt="JCS"
                            className="h-20 object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex gap-6 text-[15px] font-bold uppercase tracking-wide text-[#292929]">
                            {['About JCS', 'Our Goals', 'Initiatives', 'Events'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-').replace('our-goals', 'sdgs'))}
                                    className="hover:text-[#DE1819] transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#DE1819] transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            ))}
                        </div>
                        <MagneticButton
                            onClick={handleDashboardClick}
                            className="px-6 py-2.5 bg-[#DE1819] text-white font-bold text-sm tracking-widest hover:bg-[#b01314] transition-all shadow-lg hover:shadow-red-500/30 rounded-none"
                        >
                            DASHBOARD
                        </MagneticButton>
                    </div>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <div className="mt-[80px]">
                <HeroSlider />
            </div>

            {/* 2. Logo Section */}
            <LogoSection />

            {/* 3. About Section - Expanded & Detailed */}
            {/* 3. About Section - Expanded & Detailed */}
            {/* 3. About Section - Expanded & Detailed */}
            <section id="about-jcs" className="scroll-mt-28 py-12 px-6 md:px-12 lg:px-24 bg-white/30 backdrop-blur-lg border-t border-white/20 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="flex flex-col gap-24"
                    >
                        {/* 1. Introduction & Vision Split */}
                        {/* 1. Introduction & Vision Split */}
                        <div className="grid lg:grid-cols-12 gap-8 items-center">
                            <motion.div variants={fadeInUp} className="lg:col-span-7 mb-8 lg:mb-0">
                                <div className="w-20 h-1.5 bg-[#DE1819] mb-8"></div>
                                <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#292929] leading-[1.1] mb-8">
                                    JECRC Center for SDG's (JCS)
                                </h2>
                                <p className="text-xl text-slate-600 leading-relaxed font-light">
                                    A dedicated initiative of JECRC University focused on promoting sustainable development, environmental responsibility, and socially conscious leadership.
                                    <span className="block mt-4 font-normal text-slate-800">
                                        JCS acts as a catalyst for awareness, action, and innovation by integrating sustainability into education, campus life, and community engagement.
                                    </span>
                                </p>
                            </motion.div>

                            {/* Logo Placement */}
                            <motion.div
                                variants={fadeInUp}
                                className="lg:col-span-5 flex justify-center lg:justify-end relative"
                            >
                                <div className="relative z-10 p-8">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-emerald-50 rounded-full blur-[60px]"
                                    ></motion.div>
                                    <motion.img
                                        variants={float}
                                        animate="animate"
                                        src="/images/jcs_logo_large.png"
                                        alt="JCS Official Logo"
                                        className="w-full max-w-[450px] object-contain drop-shadow-xl relative z-10"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* 2. Vision & Mission Cards */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Vision - Dark Card */}
                            <motion.div variants={fadeInUp} className="bg-[#292929] p-12 rounded-[2rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-[#DE1819] opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150"></div>
                                <Globe className="text-[#DE1819] mb-8" size={40} />
                                <h3 className="text-3xl font-serif font-bold mb-6">Our Vision</h3>
                                <p className="text-xl leading-relaxed opacity-90 font-light border-l-4 border-[#DE1819] pl-6 italic">
                                    "To build a sustainable future by empowering youth with knowledge, responsibility, and leadership aligned with global sustainability goals."
                                </p>
                            </motion.div>

                            {/* Mission - Light Card */}
                            <motion.div variants={fadeInUp} className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50">
                                <Target className="text-[#DE1819] mb-8" size={40} />
                                <h3 className="text-3xl font-serif font-bold text-[#292929] mb-6">Our Mission</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Promote sustainability-focused education",
                                        "Encourage student participation in social initiatives",
                                        "Foster responsible leadership & ethical decision-making",
                                        "Align institutional initiatives with UN SDGs",
                                        "Create platforms for dialogue on inclusion & well-being"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-600 text-lg">
                                            <span className="w-1.5 h-1.5 bg-[#DE1819] rounded-full mt-2.5 flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* 3. What We Do - Grid */}
                        <div className="relative">
                            {/* Mesh Gradient Background for this specific section */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-70 pointer-events-none overflow-hidden">
                                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
                                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-400/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
                            </div>

                            <motion.div variants={fadeInUp} className="mb-12 text-center md:text-left relative z-10">
                                <h3 className="text-3xl font-serif font-bold text-[#292929] mb-4">What We Do</h3>
                                <p className="text-slate-500 text-lg max-w-2xl">Driving impact through diverse channels of engagement and community-led initiatives.</p>
                            </motion.div>

                            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                                {[
                                    {
                                        title: "Events & Activities",
                                        desc: "Organizing flagship conclaves like Respire '25 to foster dialogue.",
                                        icon: Calendar,
                                        color: "bg-blue-50 text-blue-600 blob-blue-300",
                                        fillColor: "group-hover:fill-blue-200 group-hover:text-blue-600",
                                        tags: ["Respire '25", "Conclaves"]
                                    },
                                    {
                                        title: "Expert Workshops",
                                        desc: "Panel discussions on social impact, policy & sustainability.",
                                        icon: Mic,
                                        color: "bg-purple-50 text-purple-600 blob-purple-300",
                                        fillColor: "group-hover:fill-purple-200 group-hover:text-purple-600",
                                        tags: ["Policy", "Sustainability"]
                                    },
                                    {
                                        title: "Awareness Campaigns",
                                        desc: "Drives for climate action, mental health & well-being.",
                                        icon: Leaf,
                                        color: "bg-green-50 text-green-600 blob-green-300",
                                        fillColor: "group-hover:fill-green-200 group-hover:text-green-600",
                                        tags: ["Climate Action", "Mental Health"]
                                    },
                                    {
                                        title: "Student Projects",
                                        desc: "Leading sustainability innovations & competitions.",
                                        icon: Lightbulb,
                                        color: "bg-yellow-50 text-yellow-600 blob-yellow-300",
                                        fillColor: "group-hover:fill-yellow-200 group-hover:text-yellow-600",
                                        tags: ["Innovation", "Startups"]
                                    },
                                    {
                                        title: "Global Collaborations",
                                        desc: "Partnering with NGOs & industry experts.",
                                        icon: Users,
                                        color: "bg-indigo-50 text-indigo-600 blob-indigo-300",
                                        fillColor: "group-hover:fill-indigo-200 group-hover:text-indigo-600",
                                        tags: ["NGOs", "UN Bodies"]
                                    },
                                    {
                                        title: "Community Service",
                                        desc: "Grassroots level engagement and social welfare drives.",
                                        icon: Recycle,
                                        color: "bg-red-50 text-red-600 blob-red-300",
                                        fillColor: "group-hover:fill-red-200 group-hover:text-red-600",
                                        tags: ["Social Welfare", "Drives"]
                                    },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeInUp}
                                        className="relative overflow-hidden bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full"
                                    >
                                        {/* Dynamic Blended Blob inside card - Fill on Hover */}
                                        <div className={`absolute -top-20 -right-20 w-64 h-64 ${item.color.split(' ').find(c => c.startsWith('blob-'))?.replace('blob-', 'bg-') || 'bg-gray-100'} opacity-20 blur-[60px] rounded-full pointer-events-none group-hover:scale-[25] group-hover:opacity-50 transition-all duration-1000 ease-in-out`}></div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-14 h-14 ${item.color.split(' ')[0]} rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center shadow-inner`}>
                                                    <item.icon className={item.color.split(' ')[1]} size={28} />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-xs font-bold text-slate-400 uppercase tracking-wider border border-white/50 group-hover:text-[#DE1819] transition-colors">
                                                    0{idx + 1}
                                                </div>
                                            </div>

                                            <h4 className="font-serif font-bold text-xl text-[#292929] mb-3 group-hover:text-[#DE1819] transition-colors">{item.title}</h4>
                                            <p className="text-slate-600 leading-relaxed text-sm mb-6 flex-grow font-medium">{item.desc}</p>

                                            {/* Tags - Glassy Pills */}
                                            <div className="flex flex-wrap gap-2">
                                                {item.tags.map((tag, tIdx) => (
                                                    <span key={tIdx} className="px-3 py-1.5 rounded-lg bg-white/50 backdrop-blur-md text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-white/40 shadow-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Watermark Icon - Fill on Hover */}
                                        <div className="absolute -bottom-4 -right-4 rotate-[-15deg] group-hover:rotate-0 group-hover:scale-110 transform transition-all duration-500 pointer-events-none">
                                            <item.icon size={140} className={`text-slate-900/5 transition-all duration-500 ${item.fillColor}`} />
                                        </div>

                                        {/* Bottom Accent Line - Gradient */}
                                        <div className={`absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-transparent via-${item.color.split(' ')[1].split('-')[1]}-500 to-transparent transition-all duration-700 group-hover:w-full opacity-80`}></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Approach & Impact - Full Width */}
                        <motion.div
                            variants={fadeInUp}
                            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center bg-gradient-to-br from-[#292929] to-[#1a1a1a] p-12 rounded-[2rem] shadow-2xl overflow-hidden relative"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DE1819] opacity-10 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32"></div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-serif font-bold text-white mb-6">Our Approach</h3>
                                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                                    JCS believes that sustainability is not a single action but a mindset. By combining academic learning with real-world engagement, we empower students to become responsible change-makers.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                                    <span className="w-2 h-2 rounded-full bg-[#DE1819]"></span>
                                    <div className="text-white font-bold uppercase tracking-widest text-xs">Innovation • Action • Awareness</div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#DE1819] rounded-lg text-white">
                                        <Zap size={20} />
                                    </div>
                                    <h4 className="font-bold text-xl text-white">Our Impact</h4>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Increased campus-wide sustainability awareness",
                                        "Fostered inclusive & responsible leadership",
                                        "Dialogues on global & local critical issues",
                                        "Strengthened institutional commitment to SDGs"
                                    ].map((impact, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</div>
                                            {impact}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 4. SDGs Grid - Interactive & Staggered */}
            <section id="sdgs" className="scroll-mt-28 py-5 px-6 md:px-12 lg:px-24 bg-white/40 backdrop-blur-3xl border-t border-white/20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="max-w-[1400px] mx-auto text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#292929] mb-6">The 17 Goals</h2>
                    <div className="w-24 h-1.5 bg-[#DE1819] mx-auto mb-8"></div>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        JECRC University is committed to advancing the United Nations Sustainable Development Goals through dedicated student chapters and research initiatives.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                >
                    {sdgs.map((sdg) => (
                        <motion.div
                            key={sdg.id}
                            variants={fadeInUp}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => setSelectedSDG(sdg)}
                            className={`${sdg.color} text-white p-6 rounded-none shadow-sm cursor-pointer flex flex-col justify-between h-52 relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}
                        >
                            <div className="absolute top-2 right-4 opacity-20 font-serif font-bold text-6xl group-hover:scale-125 transition-transform duration-500">{sdg.id}</div>

                            <div className="relative z-10">
                                <sdg.icon
                                    size={40}
                                    className="text-white/90 mb-2 group-hover:scale-110 group-hover:text-white transition-all duration-300"
                                    strokeWidth={1.5}
                                />
                                <div className="font-bold text-xl">{sdg.id}</div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="font-bold leading-tight text-sm opacity-95">{sdg.title}</h3>
                                <div className="h-[2px] w-0 bg-white mt-3 group-hover:w-8 transition-all duration-500"></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* 5. Initiatives - Glassy & Modern */}
            <section id="initiatives" className="scroll-mt-28 py-20 px-6 md:px-12 lg:px-24 bg-white/40 backdrop-blur-3xl border-t border-white/20 relative">
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 pb-8"
                    >
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-[#292929] mb-3">Campus Initiatives</h2>
                            <p className="text-slate-500 text-lg">Driving tangible impact through student-led action.</p>
                        </div>
                        <button onClick={() => navigate('/gallery')} className="text-[#DE1819] font-bold text-sm tracking-[0.15em] uppercase hover:text-black transition-colors mt-6 md:mt-0 flex items-center gap-2 group">
                            View All Events <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: Leaf, title: "Green Campus Protocol", desc: "Committed to initiating sustainable transformation by adopting green practices within the JECRC University campus and setting an example for wider impact." },
                            { icon: Users, title: "Community Adoption", desc: "Actively engaging and empowering local communities to adopt sustainable practices through awareness, participation, and long-term collaboration." },
                            { icon: Lightbulb, title: "Innovation Incubation", desc: "Providing seed funding and mentorship for student startups focused on sustainability." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="bg-white p-10 border border-gray-100 hover:border-[#DE1819]/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group rounded-2xl"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#DE1819] mb-8 group-hover:bg-[#DE1819] group-hover:text-white transition-colors duration-500 shadow-sm">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#292929] mb-4">{item.title}</h3>
                                <p className="text-slate-600 text-base leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 5.5. Generation Green Campaign - Emerald Theme (Flagship) */}
            <section id="generation-green" className="py-20 px-6 md:px-12 lg:px-24 bg-emerald-50 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] -ml-32 -mt-32 pointer-events-none"></div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-20 text-center"
                    >
                        <span className="text-emerald-600 font-bold tracking-[0.2em] text-sm uppercase bg-emerald-100 px-4 py-2 rounded-full">The Gen-G Moment</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#292929] mt-6 mb-6">Generation Green Campaign</h2>
                        <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
                            Generation Green Campaign (Gen G) an initiative by Oppo India, AICTE, NITI Aasyog and Ministry of Education to inspire and empower youth to champion sustainability through green skills and actions. In a world where environmental concerns are paramount, the campaign cultivates an eco-conscious mindset, equipping youth with the knowledge and skills to tackle environmental challenges.
                            Generation G campaign empowers the youth to embrace and advocate sustainability while focusing on management of electronic waste based the principles of Repair, Reuse and Recycle.
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-16">
                        {/* 1. Focus Areas Grid */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-4 gap-6"
                        >
                            {[
                                { title: "Awareness", icon: Lightbulb, text: "Educating on climate action & conservation." },
                                { title: "Green Practices", icon: Recycle, text: "Promoting waste reduction & energy efficiency." },
                                { title: "Engagement", icon: Users, text: "Fostering student-led environmental leadership." },
                                { title: "Impact", icon: Globe, text: "Extending sustainability beyond campus." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <item.icon size={24} />
                                    </div>
                                    <h4 className="font-serif font-bold text-lg text-[#292929] mb-2">{item.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* 2. Activities & Impact Split */}
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Activities List */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="bg-white p-10 rounded-[2rem] border border-emerald-100 shadow-sm"
                            >
                                <h3 className="text-2xl font-serif font-bold text-[#292929] mb-8">Major Activities - Real Change Doesn't Need a Filter It Needs Action and JCS Delivers</h3>

                                <div className="space-y-6">
                                    {[
                                        "Our team of 21 AICTE Authorised Interns made it possible!",
                                        "Sustainability workshops & expert sessions",
                                        "Collected over 250 kg of e-waste",
                                        "Reached out to 40+ schools",
                                        "Inspired more than 27,000+ students",
                                        "Social media to podcasts and street plays",
                                        "10,000+ Green pledges",
                                        "Green Ambassadors appointed in schools",
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            {activity !== "Our team of 21 AICTE Authorised Interns made it possible!" && (
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Leaf size={14} />
                                                </div>
                                            )}
                                            <span className="text-slate-600 text-lg">{activity}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Impact Card - Dark Emerald */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="bg-emerald-900 p-10 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden group"
                            >
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500 opacity-20 blur-[80px] rounded-full pointer-events-none transition-opacity group-hover:opacity-30"></div>

                                <div>
                                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                                        <Zap className="text-emerald-400" /> Our Impact
                                    </h3>
                                    <p className="text-emerald-100/80 text-lg leading-relaxed mb-8">
                                        <span className="text-white font-bold">Because We turned trash into triumph- The JCS style.</span>
                                        <br />
                                        It began with the Generation Green Campaign, a landmark sustainability initiative that marked a significant milestone in JECRC University’s journey toward environmental responsibility. Through this campaign, the institution’s consistent efforts in promoting sustainability, youth engagement, and eco-friendly practices were formally recognized at a national level.

                                        As a result of this impactful initiative, JECRC University was bestowed with the title of “ECO-Conscious Institution in Rajasthan” and designated as a Nodal Centre for Sustainable Initiatives. This recognition was conferred by esteemed national and global bodies, including the Ministry of Education, AICTE, NITI Aayog, OPPO India, and the 1M1B (One Million for One Billion) Foundation.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Aligned with SDGs</h4>
                                    <div className="flex gap-3 relative">
                                        {[11, 12, 13, 15].map((sdgId) => {
                                            const sdgInfo = sdgs.find(s => s.id === sdgId);
                                            return (
                                                <div key={sdgId} className="relative">
                                                    <AnimatePresence>
                                                        {activeTooltip === sdgId && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[150px] bg-white text-[#292929] text-xs font-bold py-2 px-3 rounded-lg shadow-xl z-20 text-center border border-emerald-100"
                                                            >
                                                                {sdgInfo?.title || `SDG ${sdgId}`}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <button
                                                        onClick={() => setActiveTooltip(activeTooltip === sdgId ? null : sdgId)}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border transition-all duration-300 ${activeTooltip === sdgId
                                                            ? 'bg-white text-emerald-900 border-white scale-110 shadow-lg'
                                                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                                            }`}
                                                    >
                                                        {sdgId}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Flagship Event - Respire '25 Bento Grid (Animated) */}
            <section id="events" className="py-20 px-6 bg-white/40 backdrop-blur-3xl border-t border-white/20 relative overflow-hidden">
                {/* Background Blur */}
                <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-16 text-center"
                    >
                        <span className="text-[#DE1819] font-bold tracking-[0.2em] text-sm uppercase bg-red-50 px-4 py-2 rounded-full">Flagship Sustainability Fair</span>
                        <h2 className="text-6xl md:text-7xl font-serif font-bold text-[#292929] mt-6 tracking-tight">ReSpire '25</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6"
                    >
                        {/* 1. Main Overview Card - Large */}
                        <motion.div variants={fadeInUp} className="md:col-span-8 bg-white p-10 md:p-14 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center hover:shadow-xl transition-shadow duration-500">
                            <h3 className="text-3xl font-serif font-bold text-[#292929] mb-6">Building a Sustainable Future</h3>
                            <p className="text-slate-600 text-xl leading-relaxed mb-8 font-light">
                                Re-Spire: National Conclave & Flagship Event for Sustainable Innovation

                                More than just an event, Re-Spire is a movement. It brings the country's most influential voices in sustainability to our campus, turning dialogue into action. From hosting national guests to executing high-Impact green challenges, Re-Spire is where thought leadership meets ground-level innovation to redefine what a sustainable campus looks like.

                                Re-Spire hosted a formidable alliance of sustainability crusaders-Pankti Pandey, Shristi Dubey, Mukta Arora, and Bharti Kheora. Together, these Titans of Change ignited a campus-wide revolution, moving the conversation from mere awareness to high-impact, science-backed environmental action.
                            </p>
                        </motion.div>

                        {/* 2. Theme Card - Red Accent */}
                        <motion.div variants={fadeInUp} className="md:col-span-4 bg-[#DE1819] p-10 md:p-14 rounded-[2rem] shadow-2xl shadow-red-900/20 text-white flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-white/20 group-hover:scale-150"></div>
                            <h4 className="font-bold uppercase tracking-widest opacity-80 mb-4 text-sm relative z-10">The Theme</h4>
                            <p className="text-2xl md:text-3xl font-serif font-bold leading-tight relative z-10">
                                "Building a Sustainable Future Through Youth Leadership"
                            </p>
                        </motion.div>

                        {/* 3. Image Card - Tall */}
                        <motion.div variants={fadeInUp} className="md:col-span-4 row-span-2 relative min-h-[450px] rounded-[2rem] overflow-hidden shadow-lg group">
                            <img
                                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                alt="Event Crowd"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 p-10 text-white">
                                <p className="font-serif italic text-xl opacity-90 leading-relaxed">"Where policy makers, environmentalists, and students convene."</p>
                            </div>
                        </motion.div>

                        {/* 4. Highlights Grid - 2x2 */}
                        <motion.div variants={fadeInUp} className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Mic, color: "orange", title: "Expert Keynotes", text: "Insights from ISRO scientists and sustainability leaders." },
                                { icon: Users, color: "blue", title: "Distinguished Panels", text: "UN Women reps and social leaders on gender equity." },
                                { icon: Layout, color: "green", title: "Roundtables", text: "Dialogues on mental health and empathetic leadership." },
                                { icon: Trophy, color: "purple", title: "Student Innovation", text: "Competitions showcasing creativity for real-world impact." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-xl flex items-center justify-center mb-4`}>
                                        <item.icon size={24} />
                                    </div>
                                    <h4 className="font-serif font-bold text-[#292929] mb-2 text-lg">{item.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* 5. Impact & Conclusion - Full Width Banner */}
                        <motion.div variants={fadeInUp} className="md:col-span-12 bg-[#292929] text-white p-12 md:p-16 rounded-[2rem] flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-50"></div>
                            <div className="flex-1 relative z-10">
                                <div className="flex items-center gap-3 mb-6 text-[#DE1819]">
                                    <Zap size={28} />
                                    <span className="font-bold uppercase tracking-widest text-sm">Impact</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">A Catalyst for Transformation</h3>
                                <p className="opacity-80 leading-relaxed text-lg font-light max-w-2xl">
                                    Respire 25 went beyond being an event—it reinforced JCS’s role as a platform for youth-driven change,
                                    strengthening student leadership and social consciousness across multiple institutions.
                                </p>
                            </div>
                            <div className="flex-shrink-0 relative z-10">
                                <div className="grid grid-cols-2 gap-12 text-center">
                                    <div>
                                        <div className="text-4xl md:text-5xl font-serif font-bold text-[#DE1819] mb-2">10+</div>
                                        <div className="text-xs uppercase tracking-[0.2em] opacity-60">Speakers</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl md:text-5xl font-serif font-bold text-[#DE1819] mb-2">500+</div>
                                        <div className="text-xs uppercase tracking-[0.2em] opacity-60">Students</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 7. Partner With Us CTA - Sleek Minimalist Banner */}
            <section className="py-8 px-6 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-[1200px] mx-auto bg-[#292929] rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group"
                >
                    {/* Subtle Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#DE1819] opacity-20 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20 transition-opacity duration-700 group-hover:opacity-30"></div>

                    <div className="text-left relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/10 rounded-xl text-white backdrop-blur-sm"><Users size={20} /></div>
                            <span className="text-[#DE1819] font-bold tracking-[0.2em] text-xs uppercase">Join the Mission</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Partner with JCS</h2>
                        <p className="text-slate-400 text-base md:text-lg max-w-xl font-light leading-relaxed">
                            Support sustainability through sponsorship, knowledge exchange, or joint initiatives.
                        </p>
                    </div>

                    <div className="flex-shrink-0 relative z-10">
                        <MagneticButton
                            onClick={() => setIsPartnerModalOpen(true)}
                            className="px-10 py-4 bg-[#DE1819] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#b51617] shadow-lg shadow-red-900/30 rounded-xl flex items-center gap-3"
                        >
                            Become a Partner <ArrowRight size={18} />
                        </MagneticButton>
                    </div>
                </motion.div>
            </section>

            {/* 7. Footer - PRESERVED AS IS */}
            <footer className="bg-white border-t border-slate-100 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-2">
                            <div className="font-black text-2xl text-slate-900 mb-8 flex items-center gap-3">
                                <span className="tracking-tight">JECRC Center for SGD's</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">The Center for Sustainable Development Goals is committed to fostering a culture of sustainability and impact.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-8 text-sm uppercase tracking-wider">Explore</h4>
                            <ul className="space-y-4 text-slate-500 text-sm">
                                <li onClick={() => window.open('https://jecrcuniversity.edu.in', '_blank')} className="hover:text-[#DE1819] cursor-pointer transition-colors">Jecrc University</li>
                                <li onClick={() => document.getElementById('initiatives')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#DE1819] cursor-pointer transition-colors">Our Initiatives</li>
                                <li onClick={() => navigate('/gallery')} className="hover:text-[#DE1819] cursor-pointer transition-colors">Events Gallery</li>
                                <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#DE1819] cursor-pointer transition-colors">About Us</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-8 text-sm uppercase tracking-wider">Contact</h4>
                            <div className="flex gap-4 mb-6">
                                <a
                                    href="https://www.instagram.com/jecrc.jcs?igsh=MW1tYmo0MHZ5YWJpOQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
                                >
                                    <Instagram size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/jecrc-centre-for-sustainable-development-goals/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
                                >
                                    <Linkedin size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                </a>
                                <a
                                    href="mailto:csdg@jecrcu.edu.in"
                                    className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-[#DE1819] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
                                >
                                    <Mail size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 uppercase tracking-wider">
                        <div>&copy; 2025 JECRC University Center for SDGs. All rights reserved.</div>
                        <div>Designed by JCS.</div>
                    </div>
                </div>
            </footer>

            {/* SDG Detail Modal */}
            <AnimatePresence>
                {selectedSDG && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setSelectedSDG(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full border-t-4 border-[#DE1819]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`${selectedSDG.color} p-10 text-white relative`}>
                                <button onClick={() => setSelectedSDG(null)} className="absolute top-6 right-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                    <X size={20} />
                                </button>
                                <div className="text-8xl font-serif font-black opacity-10 absolute -bottom-4 -right-4">{selectedSDG.id}</div>
                                <div className="relative z-10 pt-4">
                                    <h3 className="text-5xl font-serif font-bold mb-4">{selectedSDG.title}</h3>
                                    <p className="opacity-90 max-w-lg font-sans text-lg leading-relaxed">{selectedSDG.desc}</p>
                                </div>
                            </div>
                            <div className="p-10">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 font-serif text-xl">
                                    <Target className="text-[#DE1819]" size={24} /> Specific Targets
                                </h4>
                                <p className="text-slate-600 leading-relaxed text-lg mb-10 font-sans">
                                    {selectedSDG.details}
                                </p>

                            </div>
                        </motion.div >
                    </motion.div >
                )}
            </AnimatePresence >

            {/* Connecting to Dashboard Animation */}
            <AnimatePresence>
                {isConnecting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                            className="relative"
                        >
                            {/* Animated Rings */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-[#DE1819]/20 rounded-full blur-xl"
                            />

                            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 overflow-hidden">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-4 border-[#DE1819]/10 border-t-[#DE1819]"
                                />
                                <div className="font-serif font-bold text-2xl text-[#292929]">JCS</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 text-center"
                        >
                            <h3 className="text-2xl font-serif font-bold text-[#292929] mb-2">Connecting to Dashboard</h3>
                            <div className="flex items-center gap-1 justify-center">

                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
                                    className="text-[#DE1819]"
                                >.</motion.span>
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.4 }}
                                    className="text-[#DE1819]"
                                >.</motion.span>
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.6 }}
                                    className="text-[#DE1819]"
                                >.</motion.span>
                            </div>
                        </motion.div>

                        {/* Progress Line */}
                        <div className="w-64 h-1 bg-gray-100 rounded-full mt-8 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="w-full h-full bg-[#DE1819]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Partner Modal */}
            <PartnerModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} />

            {/* Scroll to Top Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#DE1819] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#b01314] transition-colors"
                title="Scroll to Top"
            >
                <ArrowUp size={24} strokeWidth={2.5} />
            </motion.button>
        </div>
    );
};

export default MainPage;
