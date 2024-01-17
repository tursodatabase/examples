-- Recipe book

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    nutrition_information TEXT,
    instructions TEXT,
    created_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT)),
    updated_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT))
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    measurements VARCHAR NOT NULL,
    recipe_id VARCHAR NOT NULL,
    created_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT)),
    updated_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT)),

    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
);

-- indices
CREATE INDEX IF NOT EXISTS idx_recipe_name on recipes(name);
CREATE INDEX IF NOT EXISTS idx_ingredient_name on ingredients(name);