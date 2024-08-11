import React from 'react';
import { ProgressContainer, ProgressBar, ProgressTitle } from '../../styles/ProgressBarStyles';

const Progress = ({ roomData }) => {

    const groupedByVote = roomData.users.reduce((acc, user) => {
        if (!acc[user.vote]) {
            acc[user.vote] = [];
        }
        acc[user.vote].push(user);
        return acc;
    }, {});

    const usersWithVote0 = groupedByVote['0'] || [];
    const numberOfUsersWithVote0 = usersWithVote0.length;
    const percent = ((numberOfUsersWithVote0 / roomData.users.length) * 100).toFixed(0);
    const value = 100 - percent


    return (
        <ProgressContainer>
            <ProgressBar style={{ width: `${value}%` }}>{value}%</ProgressBar>
        </ProgressContainer>
    );
};

export default Progress;
