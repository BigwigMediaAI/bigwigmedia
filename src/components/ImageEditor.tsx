import React, { useEffect, useRef } from "react";
import ImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";

const MyImageEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<ImageEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize the image editor
      editorInstanceRef.current = new ImageEditor(editorRef.current, {
        includeUI: {
          loadImage: {
            path: "", // Default image
            name: "SampleImage",
          },
          menu: [
            "crop",
            "flip",
            "rotate",
            "draw",
            "shape",
            "text",
            "filter",
            "mask",
            "icon",
          ], // Tools
          initMenu: "crop",
          uiSize: { width: "90%", height: "650px" },
          menuBarPosition: "bottom",
        },
        usageStatistics: false,
      });
    }

    return () => {
      // Cleanup when component unmounts
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div  className="mx-auto" ref={editorRef}></div>
    </div>
  );
};

export default MyImageEditor;
