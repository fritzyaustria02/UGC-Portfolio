/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  USER_INFO, 
  UGC_PRODUCTS, 
  MODEL_ASSETS, 
  GAME_PROJECTS, 
  GFX_GALLERY, 
  SFX_SAMPLES,
  UgcProduct,
  ModelAsset,
  GameProject,
  GfxItem,
  SfxSample
} from "../data";
import customPortfolioState from "../custom_portfolio_state.json";

interface UserInfo {
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  aboutLeft: string;
  aboutRight: string;
  metrics: { value: string; label: string }[];
  ugcTitle?: string;
  ugcDesc?: string;
  modelTitle?: string;
  modelDesc?: string;
  gameTitle?: string;
  gameDesc?: string;
  gfxTitle?: string;
  gfxDesc?: string;
  sfxTitle?: string;
  sfxDesc?: string;
}

interface PortfolioContextType {
  editMode: boolean;
  setEditMode: (active: boolean) => void;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  ugcProducts: UgcProduct[];
  setUgcProducts: (products: UgcProduct[]) => void;
  modelAssets: ModelAsset[];
  setModelAssets: (assets: ModelAsset[]) => void;
  gameProjects: GameProject[];
  setGameProjects: (games: GameProject[]) => void;
  gfxItems: GfxItem[];
  setGfxItems: (gfx: GfxItem[]) => void;
  sfxSamples: SfxSample[];
  setSfxSamples: (sfx: SfxSample[]) => void;
  
  // Update utilities
  updateUserInfo: (info: Partial<UserInfo>) => void;
  updateUgcProduct: (id: string, updated: Partial<UgcProduct>) => void;
  updateModelAsset: (id: string, updated: Partial<ModelAsset>) => void;
  updateGameProject: (id: string, updated: Partial<GameProject>) => void;
  updateGfxItem: (id: string, updated: Partial<GfxItem>) => void;
  updateSfxSample: (id: string, updated: Partial<SfxSample>) => void;
  
  // Adding items (optional, but helpful for customization)
  addUgcProduct: (product: Omit<UgcProduct, "id">) => UgcProduct;
  addModelAsset: (asset: Omit<ModelAsset, "id">) => ModelAsset;
  addGameProject: (game: Omit<GameProject, "id">) => GameProject;
  addGfxItem: (gfx: Omit<GfxItem, "id">) => GfxItem;
  addSfxSample: (sfx: Omit<SfxSample, "id">) => SfxSample;

  // Deleting items
  deleteUgcProduct: (id: string) => void;
  deleteModelAsset: (id: string) => void;
  deleteGameProject: (id: string) => void;
  deleteGfxItem: (id: string) => void;
  deleteSfxSample: (id: string) => void;
  
  // Reset functionality
  resetAll: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  
  const initialUserInfo = (customPortfolioState?.userInfo as UserInfo) || USER_INFO;
  const initialUgc = (customPortfolioState?.ugcProducts as UgcProduct[]) || UGC_PRODUCTS;
  const initialModels = (customPortfolioState?.modelAssets as ModelAsset[]) || MODEL_ASSETS;
  const initialGames = (customPortfolioState?.gameProjects as GameProject[]) || GAME_PROJECTS;
  const initialGfx = (customPortfolioState?.gfxItems as GfxItem[]) || GFX_GALLERY;
  const initialSfx = (customPortfolioState?.sfxSamples as SfxSample[]) || SFX_SAMPLES;

  // State variables backed up by localStorage and customPortfolioState JSON
  const [userInfo, setUserInfoState] = useState<UserInfo>(initialUserInfo);
  const [ugcProducts, setUgcProductsState] = useState<UgcProduct[]>(initialUgc);
  const [modelAssets, setModelAssetsState] = useState<ModelAsset[]>(initialModels);
  const [gameProjects, setGameProjectsState] = useState<GameProject[]>(initialGames);
  const [gfxItems, setGfxItemsState] = useState<GfxItem[]>(initialGfx);
  const [sfxSamples, setSfxSamplesState] = useState<SfxSample[]>(initialSfx);

  // Load from localStorage on initialization (overrides defaults if present)
  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem("ayumi_userInfo");
      const storedUgc = localStorage.getItem("ayumi_ugcProducts");
      const storedModels = localStorage.getItem("ayumi_modelAssets");
      const storedGames = localStorage.getItem("ayumi_gameProjects");
      const storedGfx = localStorage.getItem("ayumi_gfxItems");
      const storedSfx = localStorage.getItem("ayumi_sfxSamples");

      if (storedUserInfo) {
        const parsed = JSON.parse(storedUserInfo);
        if (parsed.metrics) {
          parsed.metrics = parsed.metrics.map((m: any) => {
            if (m.label === "Total UGC Sales" && m.value === "4.8M+") {
              return { ...m, value: "N/A" };
            }
            if (m.label === "Partner Game Visits" && m.value === "82M+") {
              return { ...m, value: "8M+" };
            }
            if (m.label === "Accessory Catalog Items" && m.value === "75+") {
              return { ...m, value: "100+" };
            }
            return m;
          });
        }
        if (parsed.aboutRight && parsed.aboutRight.includes("4 years")) {
          parsed.aboutRight = parsed.aboutRight.replace("4 years", "6 years");
        }
        localStorage.setItem("ayumi_userInfo", JSON.stringify(parsed));
        setUserInfoState({ ...initialUserInfo, ...parsed });
      }
      if (storedUgc) setUgcProductsState(JSON.parse(storedUgc));
      if (storedModels) setModelAssetsState(JSON.parse(storedModels));
      if (storedGames) setGameProjectsState(JSON.parse(storedGames));
      if (storedGfx) setGfxItemsState(JSON.parse(storedGfx));
      if (storedSfx) setSfxSamplesState(JSON.parse(storedSfx));
    } catch (e) {
      console.error("Failed to parse stored portfolio elements", e);
    }
  }, []);

  // Auto-sync current React state back to dev server workspace to update custom_portfolio_state.json
  useEffect(() => {
    // Only auto-sync while running in local or development environment
    const isDev = 
      window.location.hostname.includes("localhost") || 
      window.location.hostname.includes("run.app") || 
      window.location.hostname.includes("127.0.0.1") || 
      window.location.port === "3000";

    if (isDev) {
      const stateSnapshot = {
        userInfo,
        ugcProducts,
        modelAssets,
        gameProjects,
        gfxItems,
        sfxSamples
      };

      const timeoutId = setTimeout(() => {
        fetch("/api/save-portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stateSnapshot)
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              console.log("Portfolio changes successfully persisted in local workspace JSON!");
            }
          })
          .catch(err => {
            console.error("Auto-sync to backend failed:", err);
          });
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [userInfo, ugcProducts, modelAssets, gameProjects, gfxItems, sfxSamples]);

  // Helper functions to update state and persist
  const updateUserInfo = (updated: Partial<UserInfo>) => {
    setUserInfoState((prev) => {
      const copy = { ...prev, ...updated };
      localStorage.setItem("ayumi_userInfo", JSON.stringify(copy));
      return copy;
    });
  };

  const updateUgcProduct = (id: string, updated: Partial<UgcProduct>) => {
    setUgcProductsState((prev) => {
      const list = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      localStorage.setItem("ayumi_ugcProducts", JSON.stringify(list));
      return list;
    });
  };

  const updateModelAsset = (id: string, updated: Partial<ModelAsset>) => {
    setModelAssetsState((prev) => {
      const list = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      localStorage.setItem("ayumi_modelAssets", JSON.stringify(list));
      return list;
    });
  };

  const updateGameProject = (id: string, updated: Partial<GameProject>) => {
    setGameProjectsState((prev) => {
      const list = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      localStorage.setItem("ayumi_gameProjects", JSON.stringify(list));
      return list;
    });
  };

  const updateGfxItem = (id: string, updated: Partial<GfxItem>) => {
    setGfxItemsState((prev) => {
      const list = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      localStorage.setItem("ayumi_gfxItems", JSON.stringify(list));
      return list;
    });
  };

  const updateSfxSample = (id: string, updated: Partial<SfxSample>) => {
    setSfxSamplesState((prev) => {
      const list = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      localStorage.setItem("ayumi_sfxSamples", JSON.stringify(list));
      return list;
    });
  };

  // Add functionality
  const addUgcProduct = (product: Omit<UgcProduct, "id">): UgcProduct => {
    const newItem: UgcProduct = {
      ...product,
      id: `ugc-custom-${Date.now()}`
    };
    setUgcProductsState((prev) => {
      const list = [newItem, ...prev];
      localStorage.setItem("ayumi_ugcProducts", JSON.stringify(list));
      return list;
    });
    return newItem;
  };

  const addModelAsset = (asset: Omit<ModelAsset, "id">): ModelAsset => {
    const newItem: ModelAsset = {
      ...asset,
      id: `model-custom-${Date.now()}`
    };
    setModelAssetsState((prev) => {
      const list = [newItem, ...prev];
      localStorage.setItem("ayumi_modelAssets", JSON.stringify(list));
      return list;
    });
    return newItem;
  };

  const addGameProject = (game: Omit<GameProject, "id">): GameProject => {
    const newItem: GameProject = {
      ...game,
      id: `game-custom-${Date.now()}`
    };
    setGameProjectsState((prev) => {
      const list = [newItem, ...prev];
      localStorage.setItem("ayumi_gameProjects", JSON.stringify(list));
      return list;
    });
    return newItem;
  };

  const addGfxItem = (gfx: Omit<GfxItem, "id">): GfxItem => {
    const newItem: GfxItem = {
      ...gfx,
      id: `gfx-custom-${Date.now()}`
    };
    setGfxItemsState((prev) => {
      const list = [newItem, ...prev];
      localStorage.setItem("ayumi_gfxItems", JSON.stringify(list));
      return list;
    });
    return newItem;
  };

  const addSfxSample = (sfx: Omit<SfxSample, "id">): SfxSample => {
    const newItem: SfxSample = {
      ...sfx,
      id: `sfx-custom-${Date.now()}`
    };
    setSfxSamplesState((prev) => {
      const list = [newItem, ...prev];
      localStorage.setItem("ayumi_sfxSamples", JSON.stringify(list));
      return list;
    });
    return newItem;
  };

  // Delete functionality
  const deleteUgcProduct = (id: string) => {
    setUgcProductsState((prev) => {
      const list = prev.filter((item) => item.id !== id);
      localStorage.setItem("ayumi_ugcProducts", JSON.stringify(list));
      return list;
    });
  };

  const deleteModelAsset = (id: string) => {
    setModelAssetsState((prev) => {
      const list = prev.filter((item) => item.id !== id);
      localStorage.setItem("ayumi_modelAssets", JSON.stringify(list));
      return list;
    });
  };

  const deleteGameProject = (id: string) => {
    setGameProjectsState((prev) => {
      const list = prev.filter((item) => item.id !== id);
      localStorage.setItem("ayumi_gameProjects", JSON.stringify(list));
      return list;
    });
  };

  const deleteGfxItem = (id: string) => {
    setGfxItemsState((prev) => {
      const list = prev.filter((item) => item.id !== id);
      localStorage.setItem("ayumi_gfxItems", JSON.stringify(list));
      return list;
    });
  };

  const deleteSfxSample = (id: string) => {
    setSfxSamplesState((prev) => {
      const list = prev.filter((item) => item.id !== id);
      localStorage.setItem("ayumi_sfxSamples", JSON.stringify(list));
      return list;
    });
  };

  // Clear edits and reset to code defaults
  const resetAll = () => {
    localStorage.removeItem("ayumi_userInfo");
    localStorage.removeItem("ayumi_ugcProducts");
    localStorage.removeItem("ayumi_modelAssets");
    localStorage.removeItem("ayumi_gameProjects");
    localStorage.removeItem("ayumi_gfxItems");
    localStorage.removeItem("ayumi_sfxSamples");
    
    setUserInfoState(USER_INFO);
    setUgcProductsState(UGC_PRODUCTS);
    setModelAssetsState(MODEL_ASSETS);
    setGameProjectsState(GAME_PROJECTS);
    setGfxItemsState(GFX_GALLERY);
    setSfxSamplesState(SFX_SAMPLES);
    setEditMode(false);
  };

  return (
    <PortfolioContext.Provider
      value={{
        editMode,
        setEditMode,
        userInfo,
        setUserInfo: (info) => {
          setUserInfoState(info);
          localStorage.setItem("ayumi_userInfo", JSON.stringify(info));
        },
        ugcProducts,
        setUgcProducts: (p) => {
          setUgcProductsState(p);
          localStorage.setItem("ayumi_ugcProducts", JSON.stringify(p));
        },
        modelAssets,
        setModelAssets: (m) => {
          setModelAssetsState(m);
          localStorage.setItem("ayumi_modelAssets", JSON.stringify(m));
        },
        gameProjects,
        setGameProjects: (g) => {
          setGameProjectsState(g);
          localStorage.setItem("ayumi_gameProjects", JSON.stringify(g));
        },
        gfxItems,
        setGfxItems: (g) => {
          setGfxItemsState(g);
          localStorage.setItem("ayumi_gfxItems", JSON.stringify(g));
        },
        sfxSamples,
        setSfxSamples: (s) => {
          setSfxSamplesState(s);
          localStorage.setItem("ayumi_sfxSamples", JSON.stringify(s));
        },
        updateUserInfo,
        updateUgcProduct,
        updateModelAsset,
        updateGameProject,
        updateGfxItem,
        updateSfxSample,
        addUgcProduct,
        addModelAsset,
        addGameProject,
        addGfxItem,
        addSfxSample,
        deleteUgcProduct,
        deleteModelAsset,
        deleteGameProject,
        deleteGfxItem,
        deleteSfxSample,
        resetAll
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
