export default function calculateTimeDifference(isoTimestamp: Date) {
  const now = new Date();
  const date = new Date(isoTimestamp);

  const timeDifference = Math.abs(now.valueOf() - date.valueOf());
  const hours = timeDifference / (1000 * 60 * 60);

  return hours;
}
