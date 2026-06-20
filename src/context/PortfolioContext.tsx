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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Import actual compiled assets to resolve them to target paths dynamically
import ayumiAvatar from "../assets/images/ayumi_avatar_1781936439120.jpg";
import ugcPandaHat from "../assets/images/ugc_panda_hat_1781936455198.jpg";
import gothStarBlade from "../assets/images/goth_star_blade_1781936470753.jpg";
import gameThumbnail from "../assets/images/game_thumbnail_1781936488344.jpg";

/**
 * Maps static file paths or older paths stored in database/config safely to Vite's bundled images
 * so that they load flawlessly in any environment (including subfolder deployments like GitHub Pages).
 */
const resolveBundledUrl = (url: string | any): string | any => {
  if (typeof url !== "string") return url;
  if (url.includes("ayumi_avatar_")) {
    return ayumiAvatar;
  }
  if (url.includes("game_thumbnail_")) {
    return gameThumbnail;
  }
  if (url.includes("goth_star_blade_")) {
    return gothStarBlade;
  }
  if (url.includes("ugc_panda_hat_")) {
    return ugcPandaHat;
  }
  return url;
};


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
  // Support enabling Edit Mode via "?edit=true" in URL
  const [editMode, setEditMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("edit") === "true";
    }
    return false;
  });

  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState<boolean>(false);
  
  // Resolve potentially hardcoded paths from static files beforehand
  const initialUserInfo = customPortfolioState?.userInfo
    ? { ...customPortfolioState.userInfo, avatar: resolveBundledUrl(customPortfolioState.userInfo.avatar) }
    : USER_INFO;

  const initialUgc = (customPortfolioState?.ugcProducts as UgcProduct[])?.map(item => ({
    ...item,
    image: resolveBundledUrl(item.image)
  })) || UGC_PRODUCTS;

  const initialModels = (customPortfolioState?.modelAssets as ModelAsset[])?.map(item => ({
    ...item,
    image: resolveBundledUrl(item.image)
  })) || MODEL_ASSETS;

  const initialGames = (customPortfolioState?.gameProjects as GameProject[])?.map(item => ({
    ...item,
    thumbnail: resolveBundledUrl(item.thumbnail)
  })) || GAME_PROJECTS;

  const initialGfx = (customPortfolioState?.gfxItems as GfxItem[])?.map(item => ({
    ...item,
    image: resolveBundledUrl(item.image)
  })) || GFX_GALLERY;

  const initialSfx = (customPortfolioState?.sfxSamples as SfxSample[]) || SFX_SAMPLES;

  // State variables backed up by localStorage and customPortfolioState JSON
  const [userInfo, setUserInfoState] = useState<UserInfo>(initialUserInfo);
  const [ugcProducts, setUgcProductsState] = useState<UgcProduct[]>(initialUgc);
  const [modelAssets, setModelAssetsState] = useState<ModelAsset[]>(initialModels);
  const [gameProjects, setGameProjectsState] = useState<GameProject[]>(initialGames);
  const [gfxItems, setGfxItemsState] = useState<GfxItem[]>(initialGfx);
  const [sfxSamples, setSfxSamplesState] = useState<SfxSample[]>(initialSfx);

  // 1. Load from Firebase Cloud Firestore on mount (falls back to local storage if Firestore fails)
  useEffect(() => {
    const loadFromFirebase = async () => {
      try {
        console.log("Fetching live portfolio data from Cloud Firestore...");
        const docRef = doc(db, "portfolio", "state");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Migrate old image references to the new ones
          const cleanUserInfo = data.userInfo ? {
            ...data.userInfo,
            avatar: resolveBundledUrl(data.userInfo.avatar)
          } : null;

          const cleanUgcProducts = data.ugcProducts ? data.ugcProducts.map((item: any) => ({
            ...item,
            image: resolveBundledUrl(item.image)
          })) : null;

          const cleanModelAssets = data.modelAssets ? data.modelAssets.map((item: any) => ({
            ...item,
            image: resolveBundledUrl(item.image)
          })) : null;

          const cleanGameProjects = data.gameProjects ? data.gameProjects.map((item: any) => ({
            ...item,
            thumbnail: resolveBundledUrl(item.thumbnail)
          })) : null;

          const cleanGfxItems = data.gfxItems ? data.gfxItems.map((item: any) => ({
            ...item,
            image: resolveBundledUrl(item.image)
          })) : null;

          if (cleanUserInfo) setUserInfoState(cleanUserInfo);
          if (cleanUgcProducts) setUgcProductsState(cleanUgcProducts);
          if (cleanModelAssets) setModelAssetsState(cleanModelAssets);
          if (cleanGameProjects) setGameProjectsState(cleanGameProjects);
          if (cleanGfxItems) setGfxItemsState(cleanGfxItems);
          if (data.sfxSamples) setSfxSamplesState(data.sfxSamples);
          
          console.log("Successfully retrieved portfolio data from Firebase Cloud Database!");
        } else {
          // Sync current initial snapshot to firebase to seed it on the first run
          console.log("No data found in Firebase Cloud. Seeding database with default state...");
          await setDoc(docRef, {
            userInfo: initialUserInfo,
            ugcProducts: initialUgc,
            modelAssets: initialModels,
            gameProjects: initialGames,
            gfxItems: initialGfx,
            sfxSamples: initialSfx,
            updatedAt: Date.now()
          });
        }
      } catch (err) {
        console.warn("Unable to load from Firebase Cloud. Falling back to local values:", err);
      } finally {
        setIsFirebaseLoaded(true);
      }
    };

    loadFromFirebase();
  }, []);

  // 2. Load from localStorage as extra offline-first backup
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
        // Use local storage values only if Cloud Firestore hasn't finished loading yet 
        if (!isFirebaseLoaded) {
          setUserInfoState({ ...initialUserInfo, ...parsed });
        }
      }
      
      if (!isFirebaseLoaded) {
        if (storedUgc) setUgcProductsState(JSON.parse(storedUgc));
        if (storedModels) setModelAssetsState(JSON.parse(storedModels));
        if (storedGames) setGameProjectsState(JSON.parse(storedGames));
        if (storedGfx) setGfxItemsState(JSON.parse(storedGfx));
        if (storedSfx) setSfxSamplesState(JSON.parse(storedSfx));
      }
    } catch (e) {
      console.error("Failed to parse stored portfolio elements", e);
    }
  }, [isFirebaseLoaded]);

  // 3. Auto-sync changes back to Firebase Cloud & local dev server JSON
  useEffect(() => {
    // Prevent sync on initialization before cloud data has loaded
    if (!isFirebaseLoaded) return;

    const stateSnapshot = {
      userInfo,
      ugcProducts,
      modelAssets,
      gameProjects,
      gfxItems,
      sfxSamples,
      updatedAt: Date.now()
    };

    const isDev = 
      window.location.hostname.includes("localhost") || 
      window.location.hostname.includes("run.app") || 
      window.location.hostname.includes("127.0.0.1") || 
      window.location.port === "3000";

    const timeoutId = setTimeout(() => {
      // Auto-save: Always write to Firebase Cloud Database so we have dynamic updates on the live deployed URL!
      console.log("Synchronizing portfolio updates to Cloud database...");
      const docRef = doc(db, "portfolio", "state");
      setDoc(docRef, stateSnapshot)
        .then(() => {
          console.log("Successfully synchronized portfolio updates to Firebase Cloud Firestore.");
        })
        .catch(err => {
          console.error("Firebase Cloud Firestore synchronization failed:", err);
        });

      // Local dev workspace synchronization
      if (isDev) {
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
            console.error("Local dev workspace API sync failed:", err);
          });
      }
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [userInfo, ugcProducts, modelAssets, gameProjects, gfxItems, sfxSamples, isFirebaseLoaded]);


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
