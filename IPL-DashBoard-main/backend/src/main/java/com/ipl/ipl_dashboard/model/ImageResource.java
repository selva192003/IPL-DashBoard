package com.ipl.ipl_dashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageResource {

    @Id
    private Long id;
    private String name;
    private String type;
    private String imageUrl;
}
