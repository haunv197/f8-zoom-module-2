const widthScreen = window.innerWidth;
const tooltip = document.querySelector(".js-tooltip");

document.addEventListener("mouseover", (e) => {
  const element = e.target.getAttribute("data-tooltip")
  const tooltipBottom = e.target.getAttribute("tooltip-bottom")

  if (element) {
    tooltip.classList.remove("hide");
    tooltip.textContent = element;

    const height = e.target.offsetHeight;
    const width = e.target.offsetWidth;
    const left = e.target.offsetLeft;
    const top = e.target.offsetTop;

    const widthTooltip = tooltip.offsetWidth;
    const heightTooltip = tooltip.offsetHeight;


    const topToolTip = tooltipBottom ? (top + height + 8) : (top - heightTooltip - 4);
    const leftToolTip = left + width / 2;

    tooltip.style.top = `${topToolTip}px`;
    tooltip.style.left = 'unset';
    tooltip.style.right = 'unset';

    if (leftToolTip + widthTooltip >= widthScreen) {
      tooltip.style.right = `${leftToolTip - widthScreen - width + 8}px`
    } else if (leftToolTip - widthTooltip / 2 <= 0) {
      tooltip.style.left = `${8 + widthTooltip / 2}px`
    } else {
      tooltip.style.left = `${leftToolTip}px`
    }
  }
})

document.querySelectorAll("[data-tooltip]").forEach(item => {
  item.addEventListener("mouseleave", () => {
    tooltip.classList.add("hide");
  })
})