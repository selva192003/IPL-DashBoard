import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="HomePage min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white font-sans flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Gradients/Shapes (for visual interest) */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {/* Hero Section */}
                <header className="text-center mb-16 animate-fade-in-down">
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-2xl">
                        IPL Odyssey
                    </h1>
                    <p className="mt-6 text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto opacity-90 font-light">
                        Embark on a data-driven journey through the electrifying world of the Indian Premier League.
                        Unravel statistics, rivalries, and player brilliance like never before.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link
                            to="/teams"
                            className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-full shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 ring-offset-gray-900"
                        >
                            Explore Teams
                            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link
                            to="/head-to-head"
                            className="inline-flex items-center px-10 py-4 border-2 border-indigo-400 text-lg font-bold rounded-full text-indigo-200 bg-transparent hover:bg-indigo-700 hover:border-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 ring-offset-gray-900"
                        >
                            Compare Rivals
                            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* IPL Information Section */}
                <section className="w-full px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-3xl shadow-2xl border border-yellow-500">
                        <h2 className="text-4xl font-extrabold text-center text-yellow-300 mb-8 drop-shadow-md">
                            About the Indian Premier League
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-indigo-100">
                            <div className="space-y-4">
                                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center">
                                        <span className="mr-3">📅</span> IPL History
                                    </h3>
                                    <p className="text-lg leading-relaxed">
                                        The Indian Premier League (IPL) was founded in <strong>2008</strong> by the Board of Control for Cricket in India (BCCI). 
                                        It revolutionized cricket with its Twenty20 format, combining sports and entertainment like never before.
                                    </p>
                                </div>
                                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center">
                                        <span className="mr-3">👑</span> Most Successful Team
                                    </h3>
                                    <p className="text-lg leading-relaxed">
                                        <strong>Mumbai Indians</strong> and <strong>Chennai Super Kings</strong> are the most successful franchises, 
                                        each winning <strong>5 IPL titles</strong>. Mumbai Indians hold the record for most championships.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center">
                                        <span className="mr-3">🏏</span> Tournament Format
                                    </h3>
                                    <p className="text-lg leading-relaxed">
                                        IPL features 10 teams competing in a round-robin format followed by playoffs. 
                                        The tournament showcases the best cricketers from around the world in fast-paced T20 matches.
                                    </p>
                                </div>
                                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center">
                                        <span className="mr-3">💫</span> Global Impact
                                    </h3>
                                    <p className="text-lg leading-relaxed">
                                        IPL is one of the most-watched cricket leagues globally, attracting millions of fans. 
                                        It has become a platform for young talent and a celebration of cricket's diverse spirit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Project Features Section */}
                <section className="w-full px-4 sm:px-6 lg:px-8 mb-16">
                    <h2 className="text-4xl font-extrabold text-center text-white mb-12 drop-shadow-md">
                        What's Inside This Dashboard
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="feature-card bg-gray-800 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-3 transition-all duration-500 ease-in-out border border-indigo-700 hover:border-yellow-400 cursor-pointer">
                            <div className="text-center text-6xl mb-4 animate-bounce-slow">
                                <span role="img" aria-label="trophy">🏆</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 text-center">Team Performance Deep Dive</h3>
                            <p className="text-indigo-200 text-lg text-center leading-relaxed">
                                Analyze every team's journey, from historical win/loss ratios to season-specific statistics and interactive charts.
                            </p>
                            <div className="mt-6 text-center">
                                <Link to="/teams" className="text-yellow-300 hover:text-yellow-500 font-semibold text-lg flex items-center justify-center">
                                    View All Teams <span className="ml-2">→</span>
                                </Link>
                            </div>
                        </div>
                        <div className="feature-card bg-gray-800 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-3 transition-all duration-500 ease-in-out border border-indigo-700 hover:border-green-400 cursor-pointer">
                            <div className="text-center text-6xl mb-4 animate-pulse-slow">
                                <span role="img" aria-label="star">🌟</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 text-center">Player Excellence Tracker</h3>
                            <p className="text-indigo-200 text-lg text-center leading-relaxed">
                                Spotlight on individual brilliance. Track "Player of the Match" awards and explore player profiles with their impactful performances.
                            </p>
                            <div className="mt-6 text-center">
                                <Link to="/players" className="text-green-300 hover:text-green-500 font-semibold text-lg flex items-center justify-center">
                                    Discover Players <span className="ml-2">→</span>
                                </Link>
                            </div>
                        </div>
                        <div className="feature-card bg-gray-800 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-3 transition-all duration-500 ease-in-out border border-indigo-700 hover:border-red-400 cursor-pointer">
                            <div className="text-center text-6xl mb-4 animate-spin-slow">
                                <span role="img" aria-label="swords">⚔️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 text-center">Intense Rivalry Breakdown</h3>
                            <p className="text-indigo-200 text-lg text-center leading-relaxed">
                                Pit any two IPL giants against each other. Analyze their historical matchups, head-to-head records, and dominant victories.
                            </p>
                            <div className="mt-6 text-center">
                                <Link to="/head-to-head" className="text-red-300 hover:text-red-500 font-semibold text-lg flex items-center justify-center">
                                    Compare Head-to-Head <span className="ml-2">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer with Credits */}
                <footer className="w-full text-center mt-20 pt-12 pb-8 border-t-2 border-indigo-700 bg-gradient-to-b from-transparent to-gray-900">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Credits */}
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-2xl border border-indigo-600 shadow-xl">
                            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center justify-center">
                                <span className="mr-3">👨‍💻</span> Created By
                            </h3>
                            <p className="text-xl text-white font-semibold mb-2">Selva</p>
                            <p className="text-indigo-300 text-lg leading-relaxed">
                                Full-stack developer passionate about cricket analytics and modern web technologies. 
                                Built with React, Spring Boot, and deployed on Vercel & Render.
                            </p>
                        </div>

                        {/* Technology Stack */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-indigo-300">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="text-3xl">⚛️</div>
                                <span className="font-semibold">React</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="text-3xl">🍃</div>
                                <span className="font-semibold">Spring Boot</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="text-3xl">🎨</div>
                                <span className="font-semibold">Tailwind CSS</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="text-3xl">🗄️</div>
                                <span className="font-semibold">PostgreSQL</span>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="pt-6 border-t border-indigo-800">
                            <p className="text-indigo-300 text-lg">&copy; {new Date().getFullYear()} IPL Dashboard. All rights reserved.</p>
                            <p className="mt-2 text-indigo-400">Crafted with ❤️ for cricket enthusiasts and data lovers</p>
                        </div>

                        {/* Project Info */}
                        <div className="text-indigo-400 text-sm space-y-1">
                            <p>📊 Over 1,000+ matches analyzed</p>
                            <p>🏏 15 teams tracked across multiple seasons</p>
                            <p>⭐ 290+ player profiles and statistics</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;
