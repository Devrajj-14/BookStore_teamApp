package com.bookstore.modules.feedback.dto;

/**
 * Summary of ratings for a specific product.
 * Returned alongside the review list on the BookDetails page.
 */
public class RatingSummary {

    private Long productId;
    private Double averageRating;  // e.g. 4.3
    private long totalReviews;

    // Breakdown of how many reviews per star (1 through 5)
    private long oneStar;
    private long twoStar;
    private long threeStar;
    private long fourStar;
    private long fiveStar;

    public RatingSummary() {}

    public RatingSummary(Long productId, Double averageRating, long totalReviews,
                         long oneStar, long twoStar, long threeStar,
                         long fourStar, long fiveStar) {
        this.productId = productId;
        this.averageRating = averageRating != null
                ? Math.round(averageRating * 10.0) / 10.0  // round to 1 decimal
                : 0.0;
        this.totalReviews = totalReviews;
        this.oneStar = oneStar;
        this.twoStar = twoStar;
        this.threeStar = threeStar;
        this.fourStar = fourStar;
        this.fiveStar = fiveStar;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }

    public long getOneStar() { return oneStar; }
    public void setOneStar(long oneStar) { this.oneStar = oneStar; }

    public long getTwoStar() { return twoStar; }
    public void setTwoStar(long twoStar) { this.twoStar = twoStar; }

    public long getThreeStar() { return threeStar; }
    public void setThreeStar(long threeStar) { this.threeStar = threeStar; }

    public long getFourStar() { return fourStar; }
    public void setFourStar(long fourStar) { this.fourStar = fourStar; }

    public long getFiveStar() { return fiveStar; }
    public void setFiveStar(long fiveStar) { this.fiveStar = fiveStar; }
}
