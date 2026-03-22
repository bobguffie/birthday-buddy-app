import React, { useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, AdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
export const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

export async function initializeAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  
  await AdMob.initialize({
    testingDevices: [],
    initializeForTesting: true,
  });
}

export async function showBanner() {
  if (!Capacitor.isNativePlatform()) return;

  const options: BannerAdOptions = {
    adId: TEST_BANNER_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: true,
  };
  
  await AdMob.showBanner(options);
}

export async function hideBanner() {
  if (!Capacitor.isNativePlatform()) return;
  await AdMob.hideBanner();
}

export async function showInterstitial() {
  if (!Capacitor.isNativePlatform()) return;

  const options: AdOptions = {
    adId: TEST_INTERSTITIAL_ID,
    isTesting: true,
  };
  
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}

export const AdBanner: React.FC = () => {
  useEffect(() => {
    showBanner();
    return () => {
      hideBanner();
    };
  }, []);

  return null;
};
