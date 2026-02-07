package com.finace.fams.controller;

import com.finace.fams.dto.AssetRequest;
import com.finace.fams.entity.Asset;
import com.finace.fams.entity.User;
import com.finace.fams.exception.ResourceNotFoundException;
import com.finace.fams.repository.UserRepository;
import com.finace.fams.service.AssetService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
public class AssetController {
    private final AssetService assetService;
    private final UserRepository userRepository;

    public AssetController(AssetService assetService, UserRepository userRepository) {
        this.assetService = assetService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADD')")
    public Asset create(@Valid @RequestBody AssetRequest request) {
        return assetService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EDIT')")
    public Asset update(@PathVariable Long id, @Valid @RequestBody AssetRequest request) {
        return assetService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE')")
    public void delete(@PathVariable Long id) {
        assetService.delete(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW') and (hasRole('ADMIN') or hasRole('MANAGER') or hasRole('EMPLOYEE'))")
    public List<Asset> all() {
        return assetService.getAll();
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('VIEW')")
    public List<Asset> myAssets(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return assetService.getByOwner(user);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VIEW') and (hasRole('ADMIN') or hasRole('MANAGER') or hasRole('EMPLOYEE'))")
    public Asset one(@PathVariable Long id) {
        return assetService.getById(id);
    }

    @GetMapping("/my/{id}")
    @PreAuthorize("hasAuthority('VIEW')")
    public Asset myAsset(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Asset asset = assetService.getById(id);
        if (asset.getOwner() == null || !asset.getOwner().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Asset not found");
        }
        return asset;
    }

    @PutMapping("/{id}/valuation")
    @PreAuthorize("hasAuthority('EDIT')")
    public Asset updateValuation(@PathVariable Long id) {
        return assetService.updateValuation(id);
    }
}
