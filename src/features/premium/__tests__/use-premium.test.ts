import { renderHook, act } from "@testing-library/react-native";
import * as RNIap from "react-native-iap";

import { usePremium } from "@/features/premium/use-premium";
import * as premiumStore from "@/features/premium/premium-store";

jest.mock("react-native-iap", () => ({
  initConnection: jest.fn().mockResolvedValue(true),
  getAvailablePurchases: jest.fn(),
  fetchProducts: jest.fn().mockResolvedValue([{ productId: "remove_ads" }]),
  requestPurchase: jest.fn(),
  flushFailedPurchasesCachedAsPendingAndroid: jest.fn().mockResolvedValue(undefined),
  clearTransactionIOS: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/features/premium/premium-store", () => ({
  isPremium: jest.fn(),
  setPremiumStatus: jest.fn(),
}));

jest.mock("@/i18n/use-translation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("usePremium with react-native-iap", () => {
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = {};
    jest.clearAllMocks();
  });

  it("checks both local storage and RNIap getAvailablePurchases on load", async () => {
    // Local storage says false
    (premiumStore.isPremium as jest.Mock).mockResolvedValue(false);
    // RNIap reports previous purchase
    (RNIap.getAvailablePurchases as jest.Mock).mockResolvedValue([
      { productId: "remove_ads" },
    ]);

    const { result } = renderHook(() => usePremium({ storage: mockStorage }));

    expect(result.current.isLoading).toBe(true);

    // Wait for async load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPremium).toBe(true);
    expect(RNIap.initConnection).toHaveBeenCalledTimes(1);
    expect(RNIap.getAvailablePurchases).toHaveBeenCalledTimes(1);
    
    // It should sync the local store if RNIap says true
    expect(premiumStore.setPremiumStatus).toHaveBeenCalledWith(mockStorage, true);
  });

  it("calls RNIap.requestPurchase and updates status on success", async () => {
    (premiumStore.isPremium as jest.Mock).mockResolvedValue(false);
    (RNIap.getAvailablePurchases as jest.Mock).mockResolvedValue([]);
    
    // Mock successful purchase
    (RNIap.requestPurchase as jest.Mock).mockResolvedValue({
      productId: "remove_ads",
      transactionId: "123",
    });

    const { result } = renderHook(() => usePremium({ storage: mockStorage }));
    
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.purchaseRemoveAds();
    });

    expect(RNIap.fetchProducts).toHaveBeenCalledWith({ skus: ["remove_ads"] });
    expect(RNIap.requestPurchase).toHaveBeenCalledWith({
      type: "in-app",
      request: {
        apple: { sku: "remove_ads" },
        google: { skus: ["remove_ads"] }
      }
    });
    expect(result.current.isPremium).toBe(true);
    expect(premiumStore.setPremiumStatus).toHaveBeenCalledWith(mockStorage, true);
  });

  it("handles purchase cancellation or failure gracefully", async () => {
    (premiumStore.isPremium as jest.Mock).mockResolvedValue(false);
    (RNIap.getAvailablePurchases as jest.Mock).mockResolvedValue([]);
    
    // Mock user cancellation
    const cancelError = new Error("User cancelled");
    (RNIap.requestPurchase as jest.Mock).mockRejectedValue(cancelError);

    const { result } = renderHook(() => usePremium({ storage: mockStorage }));
    
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.purchaseRemoveAds();
    });

    // Should still be false
    expect(result.current.isPremium).toBe(false);
  });
});
