import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Globe, Users, Lightbulb, Target, Heart,
    Leaf, Zap, Scale, LayoutDashboard, X, Loader2,
    Award, Trees, Mic, Rocket, Recycle, Calendar, MapPin, CheckCircle, Smartphone
} from 'lucide-react';

import PartnerModal from '../components/PartnerModal';

const MainPage = () => {
    const navigate = useNavigate();
    const [selectedSDG, setSelectedSDG] = useState<any>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavigation = (path: string) => {
        setIsNavigating(true);
        setTimeout(() => {
            navigate(path);
        }, 1500);
    };

    // SDG Data with Details
    const sdgs = [
        { id: 1, title: "No Poverty", desc: "Ending poverty in all its forms", color: "bg-red-500", details: "Ensure significant mobilization of resources from a variety of sources to provide adequate and predictable means for developing countries." },
        { id: 2, title: "Zero Hunger", desc: "Ensuring food security & nutrition", color: "bg-yellow-500", details: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture." },
        { id: 3, title: "Good Health", desc: "Promoting healthy lives", color: "bg-green-500", details: "Ensure healthy lives and promote well-being for all at all ages." },
        { id: 4, title: "Quality Education", desc: "Inclusive & equitable education", color: "bg-red-600", details: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all." },
        { id: 5, title: "Gender Equality", desc: "Empowering women & girls", color: "bg-orange-500", details: "Achieve gender equality and empower all women and girls." },
        { id: 6, title: "Clean Water", desc: "Sustainable water management", color: "bg-cyan-500", details: "Ensure availability and sustainable management of water and sanitation for all." },
        { id: 7, title: "Clean Energy", desc: "Reliable sustainable energy", color: "bg-yellow-400", details: "Ensure access to affordable, reliable, sustainable and modern energy for all." },
        { id: 8, title: "Decent Work", desc: "Inclusive growth opportunities", color: "bg-red-700", details: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all." },
        { id: 9, title: "Innovation", desc: "Resilient infrastructure", color: "bg-orange-600", details: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation." },
        { id: 10, title: "Reduced Inequalities", desc: "Reducing inequalities", color: "bg-pink-500", details: "Reduce inequality within and among countries." },
        { id: 11, title: "Sustainable Cities", desc: "Safe, resilient urban development", color: "bg-orange-400", details: "Make cities and human settlements inclusive, safe, resilient and sustainable." },
        { id: 12, title: "Responsible Consumption", desc: "Efficient use of resources", color: "bg-yellow-600", details: "Ensure sustainable consumption and production patterns." },
        { id: 13, title: "Climate Action", desc: "Urgent climate change mitigation", color: "bg-green-700", details: "Take urgent action to combat climate change and its impacts." },
        { id: 14, title: "Life Below Water", desc: "Conserving oceans", color: "bg-blue-500", details: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development." },
        { id: 15, title: "Life on Land", desc: "Protecting terrestrial ecosystems", color: "bg-green-600", details: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, etc." },
        { id: 16, title: "Peace & Justice", desc: "Inclusive institutions", color: "bg-blue-700", details: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all." },
        { id: 17, title: "Partnerships", desc: "Strengthening global collaboration", color: "bg-blue-900", details: "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development." },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">

            {/* Loading Overlay */}
            {isNavigating && (
                <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in text-white">
                    <Loader2 size={64} className="text-brand-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold animate-pulse">Entering JCS Dashboard...</h2>
                    <p className="text-slate-400 mt-2">Connecting to student initiatives</p>
                </div>
            )}

            {/* SDG Detail Modal */}
            {selectedSDG && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedSDG(null)}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up border border-slate-200">
                        <div className={`${selectedSDG.color} p-8 text-white relative`}>
                            <button
                                onClick={() => setSelectedSDG(null)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="text-6xl font-black opacity-30 absolute top-4 left-4 select-none">
                                {selectedSDG.id}
                            </div>
                            <div className="relative z-10 pt-4">
                                <h3 className="text-3xl font-bold mb-2">{selectedSDG.title}</h3>
                                <p className="font-medium opacity-90">{selectedSDG.desc}</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <h4 className="font-bold text-slate-900 mb-3 text-lg">Goal Objectives</h4>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {selectedSDG.details}
                            </p>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedSDG(null)}
                                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full bg-slate-900 text-white z-50 py-4 px-6 shadow-lg flex justify-between items-center bg-opacity-95 backdrop-blur-sm">
                <div className="text-xl font-bold tracking-tight">
                    JECRC Center for Sustainability <span className="text-brand-400 font-normal opacity-80">| JCS</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                        <button onClick={() => scrollToSection('about')} className="hover:text-brand-400 transition-colors">Our Goals</button>
                        <button onClick={() => scrollToSection('sdgs')} className="hover:text-brand-400 transition-colors">The 17 SDGs</button>
                        <button onClick={() => scrollToSection('initiatives')} className="hover:text-brand-400 transition-colors">Initiatives</button>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-brand-400 transition-colors">Get Involved</button>
                    </div>
                    <button
                        onClick={() => handleNavigation('/dashboard')}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 shadow-sm"
                    >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </button>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <header className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/10 blur-[100px] rounded-full"></div>
                <div className="relative z-10 max-w-4xl">
                    <div className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 text-xs font-bold rounded-full mb-6 border border-brand-500/30">
                        ESTABLISHED 2025
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
                        Driving <span className="text-brand-400">Sustainable Change</span> <br />
                        & Global Impact.
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
                        A student-led core team initiative at JECRC University focused on sustainability, awareness, and taking action for a better future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => scrollToSection('initiatives')}
                            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            Explore Initiatives <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
                        >
                            Get Involved
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. About Section */}
            <section id="about" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">Building Responsible Global Citizens</h2>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                            The Center for SDGs promotes sustainability and SDG awareness across JECRC University. We work on all 17 SDGs with a strong focus on education, environment, and community.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-1"><Globe size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Our Vision</h3>
                                    <p className="text-slate-500">To build responsible global citizens driving sustainable change in their communities.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0 mt-1"><Target size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Our Mission</h3>
                                    <p className="text-slate-500">Integrate SDGs into academics, projects, and community action through student leadership.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-500 rounded-3xl transform rotate-3 opacity-20"></div>
                        <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <h3 className="text-2xl font-bold mb-6">Core Focus Areas</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                                    Student-led leadership & action
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                                    Research, innovation & outreach
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                                    Community engagement
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                                    Global partnerships
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The 17 SDGs */}
            <section id="sdgs" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">The 17 Sustainable Development Goals</h2>
                    <p className="text-slate-500 text-lg">
                        Click on any goal to learn more about our commitment. We are dedicated to advancing all 17 goals by 2030.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {sdgs.map((sdg) => (
                        <div
                            key={sdg.id}
                            onClick={() => setSelectedSDG(sdg)}
                            className={`${sdg.color} text-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 flex flex-col justify-between h-52 group active:scale-95`}
                        >
                            <div className="text-4xl font-black opacity-30 group-hover:opacity-100 transition-opacity">{sdg.id}</div>
                            <div>
                                <h3 className="font-bold leading-tight mb-2 text-lg">{sdg.title}</h3>
                                <p className="text-xs opacity-90 leading-tight group-hover:opacity-100">{sdg.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. SDGs at JECRC */}
            <section id="initiatives" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">SDGs at JECRC University</h2>
                            <p className="text-slate-400 text-lg max-w-xl">
                                Our campus is a living lab for sustainability. Here is how we are turning goals into action.
                            </p>
                        </div>
                        <button onClick={() => handleNavigation('/gallery')} className="text-brand-400 font-bold hover:text-white transition-colors flex items-center gap-2">
                            View All Events <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-brand-500/50 transition-colors">
                            <div className="w-12 h-12 bg-green-900/50 text-green-400 rounded-xl flex items-center justify-center mb-6">
                                <Leaf size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Green Campus Drives</h3>
                            <p className="text-slate-400">Regular plantation drives, waste management audits, and clean energy awareness campaigns across campus.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-brand-500/50 transition-colors">
                            <div className="w-12 h-12 bg-blue-900/50 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Student Leadership</h3>
                            <p className="text-slate-400">Workshops, seminars, and outreach programs led by student volunteers to educate peers and the community.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-brand-500/50 transition-colors">
                            <div className="w-12 h-12 bg-purple-900/50 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                                <Lightbulb size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Innovation & Research</h3>
                            <p className="text-slate-400">Supporting renewable energy research, sustainable tech innovation, and academic projects aligned with SDGs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Collaborations */}
            <section className="py-24 px-6 md:px-12 lg:px-24 bg-brand-50 border-y border-brand-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Collaborations & Partnerships</h2>
                    <p className="text-slate-600 text-lg mb-10">
                        We collaborate with NGOs, institutions, and industry leaders to build strong networks for sustainability projects. Use our platform to connect and create impact.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos - simplified as text for now */}
                        <div className="bg-white px-6 py-3 rounded-lg font-bold text-slate-400 shadow-sm">Global NGO Network</div>
                        <div className="bg-white px-6 py-3 rounded-lg font-bold text-slate-400 shadow-sm">Local Civic Bodies</div>
                        <div className="bg-white px-6 py-3 rounded-lg font-bold text-slate-400 shadow-sm">Industry Tech Partners</div>
                        <div className="bg-white px-6 py-3 rounded-lg font-bold text-slate-400 shadow-sm">Educational Institutes</div>
                    </div>
                </div>
            </section>

            {/* 6. About Us - Detailed */}
            <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-slate-100 rounded-full filter blur-[50px] opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-brand-600 uppercase mb-3">Who We Are</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display">
                            Where Ideas Grow Into <span className="text-brand-600">Action</span>
                        </h3>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            The <span className="font-bold text-slate-800">JECRC Centre for Sustainable Development Goals (JCS)</span> is a
                            student-driven initiative dedicated to promoting environmental awareness and sustainable development on campus.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-all">
                            <div className="absolute top-4 right-4 text-slate-200 group-hover:text-brand-100 transition-colors">
                                <Globe size={120} strokeWidth={0.5} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Practical Action</h4>
                            <p className="text-slate-600 relative z-10 leading-relaxed">
                                Guided by the UN Sustainable Development Goals (SDGs), JCS focuses on practical action through projects,
                                collaborations, and campaigns that create real impact. We move beyond theory to implement tangible solutions.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                    <Leaf size={24} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 text-lg">Environmental Awareness</h5>
                                    <p className="text-slate-500">Promoting eco-conscious habits across campus.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 text-lg">Student-Driven</h5>
                                    <p className="text-slate-500">A community of changemakers leading the way.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 text-lg">Real Impact</h5>
                                    <p className="text-slate-500">Projects that make a measurable difference.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Generation Green Campaign */}
            <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900 text-white overflow-hidden relative">
                {/* Background decorations */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-600/20 rounded-full filter blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full filter blur-[80px]"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-12 mb-16 items-start">
                        <div className="md:w-1/2">
                            <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full mb-4 border border-green-500/30">
                                AWARD WINNING CAMPAIGN
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Generation <span className="text-green-400">Green</span> Campaign
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                It began with the "Generation Green Campaign" where we were bestowed with the title of
                                <span className="text-white font-bold"> "ECO Conscious Institution"</span> in Rajasthan.
                            </p>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                                <div className="flex items-start gap-4">
                                    <Award className="text-yellow-400 shrink-0 mt-1" size={32} />
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Nodal Centre for Sustainable Initiatives</h4>
                                        <p className="text-sm text-slate-400">
                                            Recognized by Ministry of Education, AICTE, NITI Aayog, Oppo India and 1M1B Foundation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-green-500/50 transition-colors">
                                <div className="text-3xl font-black text-white mb-1">21</div>
                                <div className="text-sm text-slate-400">AICTE Authorised Interns team</div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-green-500/50 transition-colors">
                                <div className="text-3xl font-black text-green-400 mb-1">250 kg</div>
                                <div className="text-sm text-slate-400">E-waste collected</div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-green-500/50 transition-colors">
                                <div className="text-3xl font-black text-blue-400 mb-1">27,000+</div>
                                <div className="text-sm text-slate-400">Students inspired</div>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-green-500/50 transition-colors">
                                <div className="text-3xl font-black text-yellow-400 mb-1">10,000+</div>
                                <div className="text-sm text-slate-400">Green pledges taken</div>
                            </div>
                        </div>
                    </div>

                    {/* Outreach Strip */}
                    <div className="grid md:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-red-400" />
                            <span className="font-medium">40+ Schools Reached</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Smartphone className="text-blue-400" />
                            <span className="font-medium">Social Media & Podcasts</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mic className="text-purple-400" />
                            <span className="font-medium">Street Plays Performed</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-400" />
                            <span className="font-medium">Green Ambassadors Appointed</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. ReSpire '25 Flagship Event */}
            <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full font-bold text-sm mb-6">
                            <Calendar size={16} /> Flagship Event
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                            ReSpire <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-green-600">'25</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            A 2-day flagship sustainability summit that successfully brought together the entire university.
                            Designed to move beyond awareness to inter-departmental action.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
                        <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
                            <div className="text-5xl font-black text-slate-900 mb-2">300+</div>
                            <div className="text-slate-500 font-medium">Students & Faculty Engaged</div>
                            <div className="text-xs text-slate-400 mt-2 px-4">From Hotel Mgmt, Law, Engineering & more</div>
                        </div>
                        <div className="p-8 bg-brand-600 text-white rounded-3xl shadow-xl transform scale-105">
                            <div className="text-5xl font-black mb-2">4</div>
                            <div className="font-bold text-lg">Distinguished Keynote Speakers</div>
                            <div className="text-xs opacity-80 mt-2">Including UN Representatives</div>
                        </div>
                        <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
                            <div className="text-5xl font-black text-slate-900 mb-2">₹20L</div>
                            <div className="text-slate-500 font-medium">Green Startup Fund Announced</div>
                            <div className="text-xs text-slate-400 mt-2">To support student innovation</div>
                        </div>
                    </div>

                    {/* Key Outcomes */}
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-3xl font-bold mb-8">Major Outcomes</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                                        <Trees size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">5 Lakh Trees Pledge</h4>
                                        <p className="text-slate-600 text-sm">A massive pledge to plant 5 Lakh trees across Jaipur, positioning JCS as a leader in city-wide climate action (SDG 13).</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">SDG Lab & Innovation</h4>
                                        <p className="text-slate-600 text-sm">Official announcement of a dedicated "SDG Lab" for sustainable innovation by Vice Chairperson Shri Arpit Agarwal.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Scholarships & Academic Credits</h4>
                                        <p className="text-slate-600 text-sm">New policies to award academic credits and scholarships for practical work in sustainability.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <h3 className="text-2xl font-bold mb-6">Distinguished Speakers</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Ms. Pankti Pandey", title: "Top Sustainability Entrepreneur", icon: "🌱" },
                                    { name: "Dr. Mukta Arora", title: "UN Women Representative", icon: "🇺🇳" },
                                    { name: "Ms. Shrishti Dubey", title: "UN Representative", icon: "🌍" },
                                    { name: "Ms. Bhaarati Kheora", title: "Sustainable Green Initiative", icon: "♻️" }
                                ].map((speaker, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                        <div className="text-2xl">{speaker.icon}</div>
                                        <div>
                                            <div className="font-bold text-slate-900">{speaker.name}</div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide">{speaker.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-4 bg-brand-50 rounded-xl border border-brand-100">
                                <p className="text-sm text-brand-800 italic">
                                    "Through Outreaching & Networking, we visited various schools and conducted fun and engaging activities to spread awareness about sustainability. It helped us connect with young minds and inspire change at the grassroots level."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Get Involved */}
            <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10 bg-slate-900 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                    <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        Whether you are a student, faculty member, or partner organization, there is a place for you in our mission. Join the core team or volunteer for our next campaign.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => setIsPartnerModalOpen(true)}
                            className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg transition-colors transform hover:-translate-y-1"
                        >
                            Partner With Us
                        </button>
                    </div>
                </div>
            </section>

            {/* Partner Modal */}
            <PartnerModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} />

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-500 py-12 px-6 border-t border-slate-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <div className="text-white font-bold text-xl mb-1">Center for SDGs</div>
                        <div className="text-sm">JECRC University, Jaipur</div>
                        <a href="mailto:csdg@jecrcu.edu.in" className="text-sm text-brand-500 hover:text-brand-400 mt-1 block">csdg@jecrcu.edu.in</a>
                    </div>
                    <div className="text-sm">
                        &copy; 2025 JECRC University. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/jecrc.jcs?igsh=MW1tYmo0MHZ5YWJpOQ==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                        <a href="https://www.linkedin.com/company/jecrc-centre-for-sustainable-development-goals/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="mailto:csdg@jecrcu.edu.in" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;
