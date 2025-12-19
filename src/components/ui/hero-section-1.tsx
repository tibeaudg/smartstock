import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { GradientMeshBackground } from '@/components/ui/gradient-mesh-background'
import { GridOverlay } from '@/components/ui/grid-overlay'
import { ParticleSystem } from '@/components/ui/particle-system'
import { FloatingUICards } from '@/components/ui/floating-ui-cards'
import { CustomerLogos } from '@/components/trust/CustomerLogos'
import { ShaderGradient } from '@/components/ShaderGradient'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

// Text reveal animation for headline
const headlineWords = "Smart Inventory Management".split(" ")

export function HeroSection() {
    return (
        <>
            <main>
                <section className="relative overflow-visible">
                    <div className="relative pt-24 md:pt-36 min-h-[600px] md:min-h-[800px]" style={{ background: 'transparent' }}>
                        {/* Background Layer: ShaderGradient */}
                        <div className="absolute inset-0 z-0">
                            <ShaderGradient className="w-full h-full" />
                        </div>

                        {/* Background Layer: Animated Gradient Mesh (optional overlay) */}
                        <GradientMeshBackground />

                        {/* SVG Grid Overlay */}
                        <GridOverlay />

                        {/* Particle System Overlay */}
                        <ParticleSystem particleCount={60} />

                        {/* Content Container */}
                        <div className="mx-auto max-w-7xl px-6 relative" style={{ zIndex: 2 }}>
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants} className="mt-20">
                                    {/* Headline with gradient text and staggered word reveal */}
                                    <h1 
                                        className="max-w-4xl mx-auto text-balance text-5xl leading-tight font-bold sm:text-8xl md:text-8xl lg:text-8xl"
                                        style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                                    >
                                        {headlineWords.map((word, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.1,
                                                    ease: "easeOut"
                                                }}
                                                className={`inline-block mr-2 ${
                                                    index === headlineWords.length - 1 
                                                        ? 'text-white' 
                                                        : 'bg-white bg-clip-text text-white'
                                                }`}
                                            >
                                                {word}
                                            </motion.span>
                                        ))}
                                    </h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg text-white/90"
                                    >
                                        Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
                                    </motion.p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div key={1} className="relative">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base bg-blue-700 text-white border border-white relative overflow-hidden group shadow-[0_0_20px_rgba(29,78,216,0.5)] hover:shadow-[0_0_30px_rgba(29,78,216,0.7)] transition-shadow duration-300 cta-shimmer"
                                        >
                                            <Link to="/pricing">
                                                <span className="text-nowrap relative z-10 font-bold" style={{ fontWeight: 700 }}>Start Free Trial</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>

                        {/* Floating UI Cards */}
                        <div className="relative" style={{ zIndex: 2 }}>
                            <FloatingUICards />
                        </div>

                    
                    </div>
                </section>
            </main>
        </>
    )
}

