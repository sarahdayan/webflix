type PlayProps = React.ComponentProps<"svg">;

export function CornerDownLeft(props: PlayProps) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 10L4 15 9 20"></path>
      <path d="M20 4v7a4 4 0 01-4 4H4"></path>
    </svg>
  );
}
