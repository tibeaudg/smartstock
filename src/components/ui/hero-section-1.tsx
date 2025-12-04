import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { GridScan } from '@/components/ui/GridScan';

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
                    <div className="relative pt-24 md:pt-36 min-h-[600px] md:min-h-[800px]" style={{ background: 'transparent' }}>
                        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>



                        </div>
                        <div className="mx-auto max-w-7xl px-6 relative" style={{ zIndex: 1 }}>
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants} className="mt-20">

                        
                                    <h1
                                        className="max-w-4xl mx-auto text-balance text-5xl leading-tight font-bold sm:text-8xl md:text-8xl lg:text-8xl">
                                        Smart Inventory Management
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                        Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
                                    </p>
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
                                    <div
                                        key={1}
                                        className="">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base bg-blue-700 text-white border border-white">
                                            <Link to="/pricing">
                                                <span className="text-nowrap">Start Free Trial</span>
                                            </Link>
                                        </Button>
                                    </div>
    
                                </AnimatedGroup>
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
                            }}>
                            <div className="relative mt-8 overflow-hidden px-2 sm:px-4 sm:mt-12 md:px-6 md:mt-20 mx-auto">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl w-full overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">

                                    <img
                                        className="z-2 border-border/25 aspect-15/8 relative w-full rounded-2xl border dark:hidden"
                                        src="dashboard.png"
                                        alt="Dashboard Light"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>


                </section>
            </main>
        </>
    )
}

