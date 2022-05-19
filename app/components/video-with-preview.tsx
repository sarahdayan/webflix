import { useEffect, useState } from "react";

import { cx } from "~/utils";

type VideoStatus = "idle" | "loading" | "loaded";

type VideoWithPreviewPreviewProps = {
  status: VideoStatus;
  load: () => void;
};

type VideoWithPreviewProps = React.ComponentProps<"iframe"> & {
  preview({ status }: VideoWithPreviewPreviewProps): React.ReactNode;
};

export function VideoWithPreview({ preview, ...props }: VideoWithPreviewProps) {
  const [status, setStatus] = useState<VideoStatus>("idle");

  function load() {
    setStatus("loading");
  }

  useEffect(() => {
    setStatus("idle");
  }, [props.src]);

  return (
    <>
      {["loading", "loaded"].includes(status) && (
        /* `title` is forwarded within `props` */
        /* eslint-disable jsx-a11y/iframe-has-title */
        <iframe
          {...props}
          className={cx(status === "loading" && "hidden", props.className)}
          onLoad={(event) => {
            props.onLoad?.(event);
            setStatus("loaded");
          }}
        />
      )}
      {preview({ status, load })}
    </>
  );
}
