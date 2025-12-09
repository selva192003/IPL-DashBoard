import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from 'recharts';

const HomePage = () => {
    const [activeQuizIndex, setActiveQuizIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const iplQuizzes = [
        {
            question: "In which year was the IPL founded?",
            options: ["2005", "2008", "2010", "2012"],
            correct: 1,
            fun_fact: "IPL was launched with the first match between Kolkata Knight Riders and Royal Challengers Bangalore!"
        },
        {
            question: "Which team has won the most IPL titles?",
            options: ["Chennai Super Kings", "Kolkata Knight Riders", "Mumbai Indians", "Rajasthan Royals"],
            correct: 2,
            fun_fact: "Mumbai Indians have won 5 IPL titles, the most by any franchise in the tournament!"
        },
        {
            question: "How many teams participate in the IPL?",
            options: ["8", "10", "12", "14"],
            correct: 1,
            fun_fact: "IPL expanded to 10 teams in 2022, making it one of the world's largest T20 leagues!"
        },
        {
            question: "What does IPL stand for?",
            options: ["Indian Player League", "Indian Premier League", "International Premier League", "Indian Professional League"],
            correct: 1,
            fun_fact: "IPL is owned by the BCCI and is held every year between March and May!"
        },
        {
            question: "Which player has won the most Player of the Match awards in IPL?",
            options: ["Virat Kohli", "Suresh Raina", "Rohit Sharma", "AB de Villiers"],
            correct: 3,
            fun_fact: "AB de Villiers, known as 'Mr. 360', has been named Player of the Match 25+ times in IPL!"
        }
    ];

    const iplStats = [
        { name: 'MI', titles: 5, color: '#0066CC' },
        { name: 'CSK', titles: 5, color: '#FFFF00' },
        { name: 'KKR', titles: 3, color: '#B5651D' },
        { name: 'RR', titles: 1, color: '#FF6B9D' },
        { name: 'DC', titles: 0, color: '#4A90E2' },
        { name: 'RCB', titles: 0, color: '#FF0000' }
    ];

    const matchTrendData = [
        { year: 2008, matches: 59 },
        { year: 2010, matches: 60 },
        { year: 2015, matches: 60 },
        { year: 2018, matches: 60 },
        { year: 2022, matches: 74 },
        { year: 2025, matches: 74 }
    ];

    const handleQuizAnswer = (questionIndex, optionIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmitQuiz = () => {
        setQuizSubmitted(true);
    };

    const resetQuiz = () => {
        setActiveQuizIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
    };

    const nextQuiz = () => {
        if (activeQuizIndex < iplQuizzes.length - 1) {
            setActiveQuizIndex(activeQuizIndex + 1);
            setQuizSubmitted(false);
        }
    };

    const isAnswerCorrect = (questionIndex) => {
        return selectedAnswers[questionIndex] === iplQuizzes[questionIndex].correct;
    };

    const correctAnswersCount = Object.entries(selectedAnswers).filter(([idx, answer]) => 
        iplQuizzes[parseInt(idx)].correct === answer
    ).length;

    return (
        <div className="HomePage min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white font-sans overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative z-10 w-full">
                {/* Hero Section */}
                <header className="text-center py-20 px-4">
                    <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-2xl mb-6">
                        IPL Odyssey
                    </h1>
                    <div className="flex justify-center gap-4 mb-8">
                        <span className="text-3xl">🏏</span>
                        <span className="text-3xl">⭐</span>
                        <span className="text-3xl">🏆</span>
                    </div>
                    <p className="text-2xl sm:text-3xl text-indigo-100 max-w-4xl mx-auto font-light leading-relaxed">
                        Experience the electrifying world of Indian Premier League. 
                        Dive deep into statistics, rivalries, and legendary performances.
                    </p>
                </header>

                {/* Quick Stats Section */}
                <section className="px-4 sm:px-6 lg:px-8 mb-20 max-w-7xl mx-auto w-full">
                    <h2 className="text-5xl font-extrabold text-center mb-12 text-yellow-300">IPL Quick Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                            <div className="text-5xl font-bold text-yellow-300 mb-2">1095+</div>
                            <div className="text-xl text-blue-100">Total Matches</div>
                            <div className="mt-4 text-sm text-blue-200">Since 2008 inception</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                            <div className="text-5xl font-bold text-yellow-300 mb-2">10</div>
                            <div className="text-xl text-purple-100">Franchises</div>
                            <div className="mt-4 text-sm text-purple-200">Mumbai, Chennai, Delhi & more</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-600 to-pink-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                            <div className="text-5xl font-bold text-yellow-300 mb-2">290+</div>
                            <div className="text-xl text-pink-100">Players</div>
                            <div className="mt-4 text-sm text-pink-200">International superstars</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-600 to-green-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                            <div className="text-5xl font-bold text-yellow-300 mb-2">18</div>
                            <div className="text-xl text-green-100">Seasons</div>
                            <div className="mt-4 text-sm text-green-200">2008 - 2025</div>
                        </div>
                    </div>
                </section>

                {/* Champions Chart */}
                <section className="px-4 sm:px-6 lg:px-8 mb-20 max-w-7xl mx-auto w-full">
                    <h2 className="text-5xl font-extrabold text-center mb-12 text-yellow-300">Trophy Tally</h2>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={iplStats}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '10px' }} />
                                <Bar dataKey="titles" fill="#FBBF24" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Interactive Quiz Section */}
                <section className="px-4 sm:px-6 lg:px-8 mb-20 max-w-5xl mx-auto w-full">
                    <h2 className="text-5xl font-extrabold text-center mb-4 text-yellow-300">🎯 IPL Knowledge Quiz</h2>
                    <p className="text-center text-indigo-200 text-xl mb-12">Test your IPL expertise! Answer {iplQuizzes.length} exciting questions.</p>
                    
                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-10 shadow-2xl border border-yellow-500">
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-3">
                                <span className="text-lg font-bold text-yellow-300">Question {activeQuizIndex + 1}/{iplQuizzes.length}</span>
                                <span className="text-lg font-bold text-indigo-200">Score: {correctAnswersCount}/{Object.keys(selectedAnswers).length}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                                    style={{width: `${((activeQuizIndex + 1) / iplQuizzes.length) * 100}%`}}
                                ></div>
                            </div>
                        </div>

                        {/* Quiz Question */}
                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-white mb-8 leading-relaxed">
                                {iplQuizzes[activeQuizIndex].question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-4">
                                {iplQuizzes[activeQuizIndex].options.map((option, idx) => {
                                    const isSelected = selectedAnswers[activeQuizIndex] === idx;
                                    const isCorrect = idx === iplQuizzes[activeQuizIndex].correct;
                                    let bgColor = 'bg-gray-700 hover:bg-gray-600';
                                    
                                    if (quizSubmitted) {
                                        if (isCorrect) {
                                            bgColor = 'bg-green-600 border-2 border-green-400';
                                        } else if (isSelected && !isCorrect) {
                                            bgColor = 'bg-red-600 border-2 border-red-400';
                                        }
                                    } else if (isSelected) {
                                        bgColor = 'bg-indigo-600 border-2 border-yellow-400';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !quizSubmitted && handleQuizAnswer(activeQuizIndex, idx)}
                                            disabled={quizSubmitted}
                                            className={`w-full p-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${bgColor}`}
                                        >
                                            <span className="flex items-center">
                                                <span className="mr-4 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold">
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fun Fact */}
                        {quizSubmitted && (
                            <div className="bg-indigo-800 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
                                <p className="text-yellow-300 font-bold mb-2">💡 Fun Fact:</p>
                                <p className="text-indigo-100 text-lg">{iplQuizzes[activeQuizIndex].fun_fact}</p>
                                {isAnswerCorrect(activeQuizIndex) && (
                                    <p className="text-green-400 font-bold mt-3">✅ Correct Answer!</p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            {!quizSubmitted ? (
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={selectedAnswers[activeQuizIndex] === undefined}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl font-bold text-white hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Answer
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuiz}
                                    disabled={activeQuizIndex === iplQuizzes.length - 1}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {activeQuizIndex === iplQuizzes.length - 1 ? 'Quiz Complete! 🎉' : 'Next Question →'}
                                </button>
                            )}
                            {activeQuizIndex === iplQuizzes.length - 1 && quizSubmitted && (
                                <button
                                    onClick={resetQuiz}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl font-bold text-white hover:shadow-lg transform hover:scale-105 transition-all"
                                >
                                    Retake Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-4 sm:px-6 lg:px-8 mb-20 max-w-7xl mx-auto w-full">
                    <h2 className="text-5xl font-extrabold text-center mb-12 text-yellow-300">Explore Dashboard Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link to="/teams" className="group">
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-full cursor-pointer">
                                <div className="text-5xl mb-4">🏏</div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">Team Analysis</h3>
                                <p className="text-indigo-100">Dive into detailed team statistics, player lineups, venue performance, and championship history.</p>
                            </div>
                        </Link>
                        <Link to="/players" className="group">
                            <div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-full cursor-pointer">
                                <div className="text-5xl mb-4">⭐</div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">Player Profiles</h3>
                                <p className="text-purple-100">Discover 290+ international players, their achievements, Player of the Match awards, and career highlights.</p>
                            </div>
                        </Link>
                        <Link to="/head-to-head" className="group">
                            <div className="bg-gradient-to-br from-pink-600 to-pink-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-full cursor-pointer">
                                <div className="text-5xl mb-4">🔥</div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">Head-to-Head</h3>
                                <p className="text-pink-100">Compare your favorite teams' historical records, head-to-head statistics, and rivalry breakdowns.</p>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* IPL Information Grid */}
                <section className="px-4 sm:px-6 lg:px-8 mb-20 max-w-7xl mx-auto w-full">
                    <h2 className="text-5xl font-extrabold text-center mb-12 text-yellow-300">About IPL 2025</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-blue-900 to-cyan-900 rounded-2xl p-8 shadow-2xl border-l-4 border-cyan-400 hover:shadow-3xl transition-all">
                            <h3 className="text-3xl font-bold text-cyan-300 mb-4 flex items-center">
                                <span className="mr-3 text-4xl">📅</span> Tournament Timeline
                            </h3>
                            <p className="text-lg text-blue-100 leading-relaxed">
                                IPL 2025 features 74 matches across 18 days of electrifying cricket. The tournament showcases round-robin competition followed by thrilling playoffs and a championship finale.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-2xl p-8 shadow-2xl border-l-4 border-yellow-400 hover:shadow-3xl transition-all">
                            <h3 className="text-3xl font-bold text-yellow-300 mb-4 flex items-center">
                                <span className="mr-3 text-4xl">🌍</span> Global Reach
                            </h3>
                            <p className="text-lg text-yellow-100 leading-relaxed">
                                IPL has become the world's most-watched cricket league, attracting millions of fans globally. It's a platform for international superstars and an incubator for young talent.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-red-900 to-pink-900 rounded-2xl p-8 shadow-2xl border-l-4 border-red-400 hover:shadow-3xl transition-all">
                            <h3 className="text-3xl font-bold text-red-300 mb-4 flex items-center">
                                <span className="mr-3 text-4xl">👑</span> Champions Legacy
                            </h3>
                            <p className="text-lg text-red-100 leading-relaxed">
                                Mumbai Indians and Chennai Super Kings each have 5 titles. The tournament's competitive balance and quality of cricket make every match unpredictable and exciting.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-8 shadow-2xl border-l-4 border-green-400 hover:shadow-3xl transition-all">
                            <h3 className="text-3xl font-bold text-green-300 mb-4 flex items-center">
                                <span className="mr-3 text-4xl">💎</span> Player Excellence
                            </h3>
                            <p className="text-lg text-green-100 leading-relaxed">
                                With 290+ international players, IPL showcases extraordinary talent. AB de Villiers, Virat Kohli, Rohit Sharma, and MS Dhoni are just some legends who've defined the tournament.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 sm:px-6 lg:px-8 mb-20 max-w-5xl mx-auto w-full">
                    <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 rounded-3xl p-12 shadow-2xl text-center transform hover:scale-105 transition-all">
                        <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Explore the IPL Universe?</h2>
                        <p className="text-xl text-white mb-8 opacity-90">Analyze teams, compare players, and discover riveting match statistics.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link
                                to="/teams"
                                className="inline-block px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
                            >
                                Browse Teams
                            </Link>
                            <Link
                                to="/players"
                                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-orange-600 transform hover:scale-105 transition-all"
                            >
                                View Players
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-950 border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-yellow-300 mb-4">IPL Odyssey</h3>
                                <p className="text-gray-400">Your complete companion to Indian Premier League analytics and insights.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-indigo-300 mb-4">Technology Stack</h3>
                                <p className="text-gray-400">Built with React, Tailwind CSS, Spring Boot, and Recharts for an interactive experience.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-pink-300 mb-4">Project Stats</h3>
                                <p className="text-gray-400">1,095+ matches • 15 teams • 290+ players • Interactive analytics</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8">
                            <p className="text-center text-gray-500">
                                Created by <span className="font-bold text-yellow-300">Selva</span> • A modern take on IPL analytics
                            </p>
                            <p className="text-center text-gray-600 mt-4 text-sm">
                                © 2025 IPL Odyssey. All Rights Reserved | Powered by Cricket Data
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;
