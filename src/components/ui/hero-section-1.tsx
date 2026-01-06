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
import { Card } from './container-scroll-animation'

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


export function HeroSection() {
    return (
        <>
            <main>
                <section className="relative overflow-visible">
                    <div className="relative pt-24 md:pt-36 min-h-screen md:min-h-screen" style={{ background: 'transparent' }}>
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
                        <div className="mx-auto max-w-7xl px-6 relative pb-12" style={{ zIndex: 2 }}>
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0 items-center flex flex-col justify-center align-center pt-16">
                                <AnimatedGroup variants={transitionVariants} >
                                    {/* Headline with gradient text and staggered word reveal */}
                                    <h1 
                                        className="max-w-screen mx-auto text-balance items-center text-8xl leading-tight font-bold tracking-tight text-white"
                                        style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                                    >    
                                        Stop Wasting Money on Inventory
                                        
                                    </h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="mx-auto mt-8 text-balance text-lg text-white/90"
                                    >
                                        Scan barcodes with your phone. Track stock in real-time. Prevent stockouts. Recover capital tied in dead inventory. 500+ businesses already using StockFlow free forever.
                                    </motion.p>
                                </AnimatedGroup>
                                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                                        {/* Card 1 */}
                                        <div className="p-6 bg-white/20  rounded-lg shadow-md border border-gray-200 flex flex-col">
                                            <h3 className="text-xl font-semibold text-white mb-4">Real-Time Tracking</h3>
                                            <p className="text-white">
                                                Monitor stock levels across multiple locations with live updates, ensuring you always know what’s in stock.
                                            </p>
                                        </div>

                                        {/* Card 2 */}
                                        <div className="p-6 bg-white/20 rounded-lg shadow-md border border-gray-200 flex flex-col">
                                            <h3 className="text-xl font-semibold text-white mb-4">Capital Recovery</h3>
                                            <p className="text-white">
                                                Recover capital tied up in dead inventory by identifying slow-moving items and optimizing stock levels.
                                            </p>
                                        </div>

                                        {/* Card 3 */}
                                        <div className="p-6 bg-white/20 rounded-lg shadow-md border border-gray-200 flex flex-col">
                                            <h3 className="text-xl font-semibold text-white mb-4">Intelligent Alerts</h3>
                                            <p className="text-white">
                                                Prevent stockouts and overstock situations with automated reorder suggestions based on sales trends.
                                            </p>
                                        </div>
                                    </div>

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
                                            className="rounded-xl px-16 py-8 text-base bg-blue-700 text-white border border-white relative overflow-hidden group shadow-[0_0_20px_rgba(29,78,216,0.5)] hover:shadow-[0_0_30px_rgba(29,78,216,0.7)] transition-shadow duration-300 cta-shimmer"
                                        >
                                            <Link to="/auth">
                                                <span className="text-nowrap relative z-10 font-bold text-xl" >Join for Free</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>


                    
                    </div>
                </section>
            </main>
        </>
    )
}

