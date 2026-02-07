package com.finace.fams.controller;

import com.finace.fams.entity.AssetCategory;
import com.finace.fams.repository.AssetCategoryRepository;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final AssetCategoryRepository categoryRepository;

    public CategoryController(AssetCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW')")
    public List<AssetCategory> all() {
        return categoryRepository.findAll();
    }
}
