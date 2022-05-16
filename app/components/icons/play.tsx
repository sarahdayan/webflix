type PlayProps = React.ComponentProps<"svg">;

export function Play(props: PlayProps) {
  return (
    <svg
      {...props}
      fill="none"
      strokeWidth={48}
      stroke="currentColor"
      viewBox="0 0 512 512"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M152.443 136.417L359.557 255.99 152.443 375.583z"
      />
    </svg>
  );
}
