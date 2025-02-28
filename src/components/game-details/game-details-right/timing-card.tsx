import { FC, useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

interface IProps {
    analytics?: any
    hoursPlayed: number
}

const TimingCard: FC<IProps> = ({ analytics, hoursPlayed = 0 }) => {
    const [perc, setPerc] = useState(0)
    const [hours, setHours] = useState(0)
    useEffect(() => {
        if (hoursPlayed && analytics?.avg_hours_played) {
            let perc = (hoursPlayed / analytics?.avg_hours_played) * 100
            setPerc(+perc.toFixed(1))
            setHours(hoursPlayed - (analytics?.avg_hours_played))
        }

    }, [hoursPlayed, analytics])
    return (
        <div className="bg-[#1A2947] p-4 rounded-xl max-w-[350px]">
            <h3 className="font-semibold text-base mb-4"> Time Played Compared to Average</h3>
            <div className="grid grid-cols-[64px_1fr] gap-6">
                <div className="h-[64px] w-[64px] font-bold">
                    <CircularProgressbar value={perc} maxValue={100} text={`${perc}%`}
                        strokeWidth={12}
                        styles={buildStyles({
                            textSize: 17,
                            textColor: "white",

                            pathColor: perc >= 100 ? "#FFD700" : "#00ADFF",
                            trailColor: "#f2f4f773"
                        })}
                    />
                </div>
                <div>
                    <h4 className="text-[14px] font-medium ">{analytics?.avg_hours_played || 0} Hours Played On Avg</h4>
                    <p className="text-[14px] font-normal opacity-60">
                        You played {Math.abs(hours)} hours {hours <= 0 ? hours == 0 ? "" : "less than" : "more than"} the average user.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimingCard;
