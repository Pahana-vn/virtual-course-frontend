import { useState, useEffect } from "react";
import { getVideoId, fetchVideoDuration, parseIsoDuration } from "../utils/youtubeUtils";

const useLectureDurations = (lectures) => {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    const fetchDurations = async () => {
      const newDurations = {};
      for (const lecture of lectures || []) {
        const videoId = getVideoId(lecture.lectureVideo);
        if (videoId) {
          const isoDuration = await fetchVideoDuration(videoId);
          newDurations[lecture.id] = isoDuration
            ? parseIsoDuration(isoDuration)
            : "N/A";
        } else {
          newDurations[lecture.id] = "N/A";
        }
      }
      setDurations(newDurations);
    };
  
    if (lectures?.length) {
      fetchDurations();
    }
  }, [JSON.stringify(lectures)]);

  return durations;
};

export default useLectureDurations;