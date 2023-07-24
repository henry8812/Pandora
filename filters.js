function renderStars(rating) {
    const filledStars = '&#9733;'.repeat(Math.floor(rating));
    const halfStar = rating - Math.floor(rating) >= 0.5 ? '&#9733;' : '';
    const emptyStars = '&#9734;'.repeat(5 - Math.ceil(rating));

    return filledStars + halfStar + emptyStars;
}

module.exports = {
    renderStars: renderStars,
};