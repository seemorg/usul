import type { WebViewerInstance } from "@pdftron/webviewer";

export const makePdfViewerButtons = (instance: WebViewerInstance) => {
  const downloadButton = {
    type: "actionButton",
    img: "icon-header-download",
    element: "downloadButton",
    onClick: () => {
      instance.UI.downloadPdf();
    },
  };

  let listener: () => void;

  const fullscreenButton = {
    type: "statefulButton",
    initialState: "minimized",
    dataElement: "fullscreenButton",
    states: {
      minimized: {
        img: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen</title><path class="cls-1" d="M4.22,4.22H9.78V2H2V9.78H4.22ZM9.78,19.78H4.22V14.22H2V22H9.78ZM22,14.22H19.78v5.56H14.22V22H22ZM19.78,9.78H22V2H14.22V4.22h5.56Z"></path></svg>`,
        onClick: () => {
          instance.UI.toggleFullScreen();
        },
      },
      full: {
        img: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen - exit</title><path class="cls-1" d="M9.5,2H7V7H2V9.5H9.5ZM7,22H9.5V14.5H2V17H7Zm15-7.5H14.5V22H17V17h5ZM22,7H17V2H14.5V9.5H22Z"></path></svg>`,
        onClick: () => {
          instance.UI.toggleFullScreen();
        },
      },
    },
    mount: (update: any) => {
      const fullscreenToState = () => {
        // the returned state should be the opposite of the new current state
        // as the opposite state is what we want to switch to when the button
        // is clicked next
        const newState = instance.UI.isFullscreen() ? "minimized" : "full";

        update(newState);
      };
      listener = fullscreenToState;
      instance.UI.addEventListener(
        instance.UI.Events.FULLSCREEN_MODE_TOGGLED,
        fullscreenToState,
      );
    },
    unmount: () => {
      instance.UI.removeEventListener(
        instance.UI.Events.FULLSCREEN_MODE_TOGGLED,
        listener,
      );
    },
  };

  return [downloadButton, fullscreenButton];
};
