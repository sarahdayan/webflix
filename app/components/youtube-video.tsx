import { Play } from "~/components/icons/play";
import { Spinner } from "~/components/icons/spinner";
import { VideoWithPreview } from "~/components/video-with-preview";

type YouTubeVideoProps = {
  id: string;
};

export function YouTubeVideo({ id }: YouTubeVideoProps) {
  return (
    <VideoWithPreview
      className="w-full rounded aspect-video"
      allow="autoplay"
      src={`//www.youtube.com/embed/${id}?autoplay=1&showinfo=0`}
      preview={({ status, load }) =>
        ["idle", "loading"].includes(status) && (
          <button onClick={() => load()} className="block group">
            <div className="relative flex items-center overflow-hidden text-white rounded aspect-video">
              <img
                src={`//img.youtube.com/vi/${id}/hqdefault.jpg`}
                className="transition-opacity opacity-80 group-hover:opacity-100"
                alt="YouTube video preview"
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 transition-opacity from-dark-blue bg-gradient-to-t opacity-80 group-hover:opacity-70" />
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
      className="absolute flex-none w-20 h-20 transition-transform -translate-x-1/2 -translate-y-1/2 fill-current top-1/2 left-1/2 group-hover:scale-110"
      aria-hidden="true"
    />
  );
}

function SpinnerIcon() {
  return (
    <div className="absolute flex-none w-10 h-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Spinner className="animate-spin" aria-hidden="true" />
    </div>
  );
}
