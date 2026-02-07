import React from 'react';
import { motion } from 'framer-motion';

const LogoSection = () => {
    const logos = [
        "United Nations", "AICTE", "Ministry of Education",
        "NITI Aayog", "1M1B Foundation", "OPPO India"
    ];

    return (
        <div className="py-12 bg-white border-b border-gray-100 overflow-hidden">
            <div className="flex w-full">
                <motion.div
                    className="flex gap-16 items-center whitespace-nowrap px-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    style={{ willChange: "transform" }}
                >
                    {[...logos, ...logos, ...logos].map((logo, index) => (
                        <div key={index} className="text-2xl font-serif font-bold text-slate-300 hover:text-[#DE1819] transition-colors cursor-default">
                            {logo}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LogoSection;
