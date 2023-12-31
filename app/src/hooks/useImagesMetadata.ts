import { useEffect, useState } from "react";
import readImageMetadata from "../utils/imageMetadata/readImageMetadata";
import { useNotification } from "../singleton/Notification/Store";
import { exists, readDir } from "@tauri-apps/api/fs";
import { useImageDirPathConfiguratorStore } from "../singleton/ImageDirPathConfigurator/Store";
import { Metadata } from "../types/imageMetadata";

const useImagesMetadata = () => {
  const [imagesMetadata, setImagesMetadata] = useState<Metadata[]>([]);
  const showNotification = useNotification();
  const imageDirs = useImageDirPathConfiguratorStore(
    (state) => state.imageDirs
  );

  useEffect(() => {
    console.debug("Detecting image dirs changes", imageDirs);
    fetchMetadata();
  }, [imageDirs]);

  const fetchMetadata = () => {
    const imagesMetadata: Metadata[] = [];

    // Why not forEach async (because it will cause a bunch of re-renders)
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    // TODO: make it incremental (at least give user the option to do so)
    Promise.all(
      [...imageDirs].map(async (imageDir) => {
        if (!(await exists(imageDir))) {
          showNotification(
            "Warning",
            `Image directory ${imageDir} does not exist`
          );
          return;
        }

        const entries = await readDir(imageDir);
        await Promise.all(
          entries.map(async (entry) => {
            let imageMetadata;
            // Wrap in try catch to prevent Tauri fs permission issues
            try {
              imageMetadata = await readImageMetadata(entry.path);
            } catch (err) {
              console.error(
                "Encoounter error while reading image metadata",
                err
              );
              showNotification(
                "Warning",
                `Encountered an error while trying to read ${entry.path}`
              );
            }

            if (!imageMetadata) return;

            console.debug("Entry", entry);
            console.debug("Image Metadata", imageMetadata);

            imagesMetadata.push({
              ...imageMetadata,
              imageBaseDir: imageDir,
              imageSrc: entry.name!,
            });
          })
        );
      })
    ).then(() => {
      console.info("Loaded images metadata", imagesMetadata);
      setImagesMetadata(imagesMetadata);
    });
  };

  return imagesMetadata;
};

export default useImagesMetadata;
