document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const items = document.querySelectorAll('.recipe-item');
    const categories = document.querySelectorAll('.category-group');

    function filter() {
        const activeCourses = Array.from(document.querySelectorAll('input[name="course"]:checked')).map(cb => cb.value);
        const activeEthnicities = Array.from(document.querySelectorAll('input[name="ethnicity"]:checked')).map(cb => cb.value);

        categories.forEach(cat => {
            let catHasVisibleItems = false;
            const catItems = cat.querySelectorAll('.recipe-item');

            catItems.forEach(item => {
                const itemCourse = item.getAttribute('data-course');
                const itemEthnicity = item.getAttribute('data-ethnicity');

                const courseMatch = activeCourses.length === 0 || activeCourses.includes(itemCourse);
                const ethMatch = activeEthnicities.length === 0 || activeEthnicities.includes(itemEthnicity);

                if (courseMatch && ethMatch) {
                    item.style.display = 'flex';
                    catHasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // Handle the category visibility based on child items
            cat.style.display = catHasVisibleItems ? 'block' : 'none';
        });
    }

    checkboxes.forEach(cb => cb.addEventListener('change', filter));
});
