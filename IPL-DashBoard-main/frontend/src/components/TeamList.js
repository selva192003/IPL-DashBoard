import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamCard from "./TeamCard";
import Loader from './Loader'; // Assuming you have a Loader component

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/team`);
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
                setError("Failed to load teams. Please check the backend connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="TeamList p-4 text-white">
            <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">IPL Teams</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <TeamCard key={team.teamName} team={team} />
                ))}
            </div>
        </div>
    );
};

export default TeamList;
