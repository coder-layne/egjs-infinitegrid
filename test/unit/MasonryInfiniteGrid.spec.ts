import { MasonryInfiniteGrid, OnRequestAppend } from "../../src";
import { cleanup, sandbox, waitEvent } from "./utils/utils";

describe("test InfiniteGrid", () => {
  let ig: MasonryInfiniteGrid | null;
  let container: HTMLElement | null;
  beforeEach(() => {
    container = sandbox("")!;
    container!.style.cssText = "";
  });

  afterEach(() => {
    if (ig) {
      ig!.destroy();
    }
    ig = null;
    container = null;
    cleanup();
  });
  describe("test outlines", () => {
    it("should check whether the outline of the invisible area and the visible area are connected", async () => {
      container!.innerHTML = `<div class="wrapper" style="width: 100%; height: 500px;"></div>`;
      const wrapper = container!.querySelector<HTMLElement>(".wrapper")!;
      ig = new MasonryInfiniteGrid(wrapper, {
        container: true,
      });

      // Given
      const igScrollContainer = ig!.getScrollContainerElement();

      ig!.syncItems([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((child) => {
        return {
          groupKey: Math.floor(child / 4),
          key: `key${child}`,
          html: `<div style="position:absolute; width: 150px; height: 250px">${child}</div>`,
        };
      }));

      ig!.setCursors(0, 2);
      ig!.renderItems();

      // console.log(ig.getRenderingItems());

      await waitEvent(ig!, "renderComplete");

      const outlineLength1 = ig!.getVisibleGroups()[0].grid.getOutlines().start.length;
      // When
      // [1, 2]
      igScrollContainer.scrollTop = 1000;

      await waitEvent(ig!, "renderComplete");

      // [1]
      ig!.getVisibleItems().forEach((item) => {
        item.element!.style.cssText = "width: 300px";
      });
      ig.updateItems();

      await waitEvent(ig!, "renderComplete");

      const outlineLength2 = ig!.getVisibleGroups()[0].grid.getOutlines().start.length;

      // Then
      expect(outlineLength1).to.be.equals(2);
      expect(outlineLength2).to.be.equals(1);
    });
  });
});