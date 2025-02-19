export const getVideoId = (url) => {
    const regex = /(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=)([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[1].length === 11 ? match[1] : null;
  };
  
  export const fetchVideoDuration = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_DATA_API_V3}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].contentDetails.duration; // ISO 8601 duration
      }
      return null;
    } catch (error) {
      console.error("Error fetching video duration:", error);
      return null;
    }
  };
  
  export const parseIsoDuration = (isoDuration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);
    const hours = parseInt(matches[1] || 0, 10);
    const minutes = parseInt(matches[2] || 0, 10);
    const seconds = parseInt(matches[3] || 0, 10);
  
    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };