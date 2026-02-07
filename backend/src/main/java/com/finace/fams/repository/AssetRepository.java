package com.finace.fams.repository;

import com.finace.fams.entity.Asset;
import com.finace.fams.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByOwner(User owner);
}
