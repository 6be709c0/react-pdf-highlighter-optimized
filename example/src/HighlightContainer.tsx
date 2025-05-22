import React, { MouseEvent } from "react";
import HighlightPopup from "./HighlightPopup";
import {
  AreaHighlight,
  MonitoredHighlightContainer,
  TextHighlight,
  Tip,
  ViewportHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
} from "./react-pdf-highlighter-optimized";
import { CommentedHighlight } from "./types";

interface HighlightContainerProps {
  enableEdit: boolean;
  editHighlight: (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>
  ) => void;
  onContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>
  ) => void;
}

const HighlightContainer = ({
  editHighlight,
  onContextMenu,
  enableEdit,
}: HighlightContainerProps) => {
  const {
    highlight,
    viewportToScaled,
    screenshot,
    isScrolledTo,
    // isVisible,
    highlightBindings,
  } = useHighlightContainerContext<CommentedHighlight>();

  const { toggleEditInProgress } = usePdfHighlighterContext();

  const component =
    highlight.type === "text" ? (
      <TextHighlight
        isScrolledTo={isScrolledTo}
        // isScrolledTo={isScrolledTo || isVisible}
        highlight={highlight}
        onContextMenu={(event:any) =>
          onContextMenu && onContextMenu(event, highlight)
        }
      />
    ) : (
      <AreaHighlight
        isScrolledTo={isScrolledTo}
        // isScrolledTo={isScrolledTo || isVisible}
        highlight={highlight}
        isEditEnabled={false}
        onChange={(boundingRect) => {
          if (!enableEdit) return;
          const edit = {
            position: {
              boundingRect: viewportToScaled(boundingRect),
              rects: [],
            },
            content: {
              image: screenshot(boundingRect),
            },
          };

          editHighlight(highlight.id, edit);
          toggleEditInProgress(false);
        }}
        bounds={highlightBindings.textLayer}
        onContextMenu={(event) => {
          onContextMenu && onContextMenu(event, highlight);
        }}
        onEditStart={() => {
          toggleEditInProgress(true);
        }}
      />
    );

  const highlightTip: Tip = {
    position: highlight.position,
    content: <HighlightPopup highlight={highlight} />,
  };

  return (
    <MonitoredHighlightContainer
      highlightTip={highlightTip}
      key={highlight.id}
      children={component}
    />
  );
};

export default HighlightContainer;
