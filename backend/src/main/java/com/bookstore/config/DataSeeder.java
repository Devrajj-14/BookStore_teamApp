package com.bookstore.config;

import com.bookstore.entity.Category;
import com.bookstore.entity.Product;
import com.bookstore.modules.product.repository.CategoryRepository;
import com.bookstore.modules.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() > 0) return; // already seeded

            // Categories
            Category fiction    = save(categoryRepository, "Fiction",     "Novels and stories");
            Category nonFiction = save(categoryRepository, "Non-Fiction", "Real-world knowledge");
            Category science    = save(categoryRepository, "Science",     "Science and technology");
            Category history    = save(categoryRepository, "History",     "Historical accounts");
            Category tech       = save(categoryRepository, "Technology",  "Programming and tech");

            // Books
            addBook(productRepository, fiction,    "The Great Gatsby",              "F. Scott Fitzgerald", new BigDecimal("299"),  15, "https://covers.openlibrary.org/b/id/8432472-L.jpg");
            addBook(productRepository, fiction,    "To Kill a Mockingbird",         "Harper Lee",          new BigDecimal("349"),  20, "https://covers.openlibrary.org/b/id/8228691-L.jpg");
            addBook(productRepository, fiction,    "1984",                          "George Orwell",       new BigDecimal("279"),  25, "https://covers.openlibrary.org/b/id/7222246-L.jpg");
            addBook(productRepository, fiction,    "Pride and Prejudice",           "Jane Austen",         new BigDecimal("249"),  30, "https://covers.openlibrary.org/b/id/8739161-L.jpg");
            addBook(productRepository, fiction,    "The Alchemist",                 "Paulo Coelho",        new BigDecimal("319"),  18, "https://covers.openlibrary.org/b/id/8479576-L.jpg");
            addBook(productRepository, nonFiction, "Sapiens",                       "Yuval Noah Harari",   new BigDecimal("499"),  12, "https://covers.openlibrary.org/b/id/8739165-L.jpg");
            addBook(productRepository, nonFiction, "Atomic Habits",                 "James Clear",         new BigDecimal("449"),  22, "https://covers.openlibrary.org/b/id/10527843-L.jpg");
            addBook(productRepository, nonFiction, "The Power of Now",              "Eckhart Tolle",       new BigDecimal("379"),  10, "https://covers.openlibrary.org/b/id/8228688-L.jpg");
            addBook(productRepository, science,    "A Brief History of Time",       "Stephen Hawking",     new BigDecimal("399"),  8,  "https://covers.openlibrary.org/b/id/8432471-L.jpg");
            addBook(productRepository, science,    "The Selfish Gene",              "Richard Dawkins",     new BigDecimal("359"),  14, "https://covers.openlibrary.org/b/id/8228690-L.jpg");
            addBook(productRepository, history,    "Guns, Germs, and Steel",        "Jared Diamond",       new BigDecimal("429"),  9,  "https://covers.openlibrary.org/b/id/8432470-L.jpg");
            addBook(productRepository, history,    "The Diary of a Young Girl",     "Anne Frank",          new BigDecimal("299"),  35, "https://covers.openlibrary.org/b/id/8228689-L.jpg");
            addBook(productRepository, tech,       "Clean Code",                    "Robert C. Martin",    new BigDecimal("599"),  7,  "https://covers.openlibrary.org/b/id/8432469-L.jpg");
            addBook(productRepository, tech,       "The Pragmatic Programmer",      "Andrew Hunt",         new BigDecimal("649"),  6,  "https://covers.openlibrary.org/b/id/8228687-L.jpg");
            addBook(productRepository, tech,       "Design Patterns",               "Gang of Four",        new BigDecimal("699"),  5,  "https://covers.openlibrary.org/b/id/8432468-L.jpg");

            System.out.println("✅ Seeded 5 categories and 15 books.");
        };
    }

    private Category save(CategoryRepository repo, String name, String desc) {
        return repo.findByName(name).orElseGet(() -> {
            Category c = new Category();
            c.setName(name);
            c.setDescription(desc);
            return repo.save(c);
        });
    }

    private void addBook(ProductRepository repo, Category category, String title,
                         String author, BigDecimal price, int stock, String imageUrl) {
        Product p = new Product();
        p.setTitle(title);
        p.setAuthor(author);
        p.setPrice(price);
        p.setStockQuantity(stock);
        p.setImageUrl(imageUrl);
        p.setCategory(category);
        p.setDescription("A must-read book: " + title);
        p.setIsbn("ISBN-" + title.hashCode());
        repo.save(p);
    }
}
