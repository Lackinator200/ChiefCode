document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("swipeup");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
        else if (entry.target.classList.contains("is-visible") && entry.isIntersecting) {
          // If the element is not intersecting and has the class 'is-visible', remove it
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      root: null,        // viewport
      threshold: 0.70    // 70% of element visible
    }
  );

  observer.observe(container);
  // Second observer for the second container
  // Assuming you have another container with id "swipeup2"
    const container2 = document.getElementById("swipeup2");

  const observer2 = new IntersectionObserver(
    (entries, observer2) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer2.unobserve(entry.target);
        }
        else if (entry.target.classList.contains("is-visible") && entry.isIntersecting) {
          // If the element is not intersecting and has the class 'is-visible', remove it
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      root: null,        // viewport
      threshold: 0.70    // 70% of element visible
    }
  );
});