import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
    {
        id: 1,
        // REPLACE IMAGE: Overwrite 'public/images/hero/slide1.jpg' with your own image
        image: "/images/hero/slide1.jpg",
        title: "Building Global Changemakers",
        subtitle: "JECRC Center for Sustainable Development Goals"
    },
    {
        id: 2,
        // REPLACE IMAGE: Overwrite 'public/images/hero/slide2.jpg' with your own image
        image: "/images/hero/slide2.jpg",
        title: "Innovation for Impact",
        subtitle: "Aligning Research with United Nations Goals"
    },
    {
        id: 3,
        // REPLACE IMAGE: Overwrite 'public/images/hero/slide3.jpg' with your own image
        image: "/images/hero/slide3.jpg",
        title: "Leadership in Action",
        subtitle: "Empowering Students to Lead the Future"
    },
    // 8 Additional Slides
    {
        id: 4,
        image: "/images/hero/slide4.jpg",
        title: "Nature's Harmony",
        subtitle: "Preserving Our Planet's Natural Beauty"
    },
    {
        id: 5,
        image: "/images/hero/slide5.jpg",
        title: "Sustainable Communties",
        subtitle: "Fostering Eco-Friendly Living Spaces"
    },
    {
        id: 6,
        image: "/images/hero/slide6.jpg",
        title: "Youth Voices",
        subtitle: "Amplifying the Call for Climate Action"
    }
];

const HeroSlider = () => {
    return (
        <div className="relative w-full h-[600px] md:h-[750px] overflow-hidden group">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                loop={true}
                speed={1000}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="h-full w-full"
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ clickable: true }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <div className="absolute inset-0 bg-black/40 z-10"></div>
                            <SmartImage
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-linear scale-100 animate-zoom-slow"
                            />
                            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="max-w-4xl"
                                >
                                    <div className="w-20 h-1 bg-[#DE1819] mb-8"></div>
                                    <h2 className="text-white text-lg md:text-xl font-bold tracking-[0.2em] uppercase mb-4 opacity-90">
                                        {slide.subtitle}
                                    </h2>
                                    <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-8">
                                        {slide.title}
                                    </h1>
                                    <button
                                        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 bg-[#DE1819] text-white font-bold uppercase tracking-widest hover:bg-[#b01314] transition-colors flex items-center gap-3"
                                    >
                                        Explore Initiatives <ArrowRight size={20} />
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation */}
            <div className="absolute bottom-12 right-12 z-30 flex gap-4">
                <button className="swiper-button-prev-custom w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#DE1819] hover:border-[#DE1819] transition-all cursor-pointer">
                    <ChevronLeft size={24} />
                </button>
                <button className="swiper-button-next-custom w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#DE1819] hover:border-[#DE1819] transition-all cursor-pointer">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default HeroSlider;

const SmartImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [currentSrc, setCurrentSrc] = React.useState(src);
    const [errorCount, setErrorCount] = React.useState(0);

    const handleError = () => {
        const extensions = ['.jpg', '.png', '.jpeg', '.webp'];
        // Extract current extension (e.g., '.jpg')
        const match = currentSrc.match(/\.[^.]+$/);
        const currentExt = match ? match[0] : '';

        if (!currentExt) return;

        const currentIndex = extensions.indexOf(currentExt.toLowerCase());

        // If we haven't tried all extensions yet
        if (currentIndex !== -1 && currentIndex < extensions.length - 1) {
            const nextExt = extensions[currentIndex + 1];
            // Replace extension in the original path base to avoid accumulated errors if we were to modify currentSrc only
            // But here currentSrc is the source of truth for the NEXT attempt.
            // Actually, we should always go back to the base.
            // But simplistic approach: replace current extension with next one.
            const newSrc = currentSrc.replace(currentExt, nextExt);
            setCurrentSrc(newSrc);
            setErrorCount(prev => prev + 1);
        }
    };

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

