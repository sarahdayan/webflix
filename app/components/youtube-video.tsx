import { Play } from "~/components/icons/play";
import { Spinner } from "~/components/icons/spinner";
import { VideoWithPreview } from "~/components/video-with-preview";

type YouTubeVideoProps = {
  id: string;
};

export function YouTubeVideo({ id }: YouTubeVideoProps) {
  return (
    <VideoWithPreview
      className="aspect-video w-full rounded"
      allow="autoplay"
      src={`//www.youtube.com/embed/${id}?autoplay=1&showinfo=0`}
      preview={({ status, load }) =>
        ["idle", "loading"].includes(status) && (
          <button onClick={() => load()} className="group block">
            <div className="relative flex aspect-video items-center overflow-hidden rounded text-white">
              <img
                src={`//img.youtube.com/vi/${id}/hqdefault.jpg`}
                className="opacity-80 transition-opacity group-hover:opacity-100"
                alt="YouTube video preview"
              />
              <div className="from-dark-blue absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t opacity-80 transition-opacity group-hover:opacity-70" />
              {status === "idle" && <PlayIcon />}
              {status === "loading" && <SpinnerIcon />}
            </div>
          </button>
        )
      }
    />
  );
}

function PlayIcon() {
  return (
    <Play
      className="absolute top-1/2 left-1/2 h-20 w-20 flex-none -translate-x-1/2 -translate-y-1/2 fill-current transition-transform group-hover:scale-110"
      aria-hidden="true"
    />
  );
}

function SpinnerIcon() {
  return (
    <div className="absolute top-1/2 left-1/2 h-10 w-10 flex-none -translate-x-1/2 -translate-y-1/2">
      <Spinner className="animate-spin" aria-hidden="true" />
    </div>
  );
}
