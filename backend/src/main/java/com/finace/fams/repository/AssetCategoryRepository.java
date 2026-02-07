package com.finace.fams.repository;

import com.finace.fams.entity.AssetCategory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {
    Optional<AssetCategory> findByName(String name);
}
