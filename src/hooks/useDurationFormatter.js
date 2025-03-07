
const useDurationFormatter = () => {
  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.round((durationInSeconds % 3600) / 60);

    return `${hours} hrs ${minutes} mins`;
  };

  return formatDuration;
};

export default useDurationFormatter;
