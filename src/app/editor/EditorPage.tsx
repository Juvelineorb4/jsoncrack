"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMantineColorScheme } from "@mantine/core";
import "@mantine/dropzone/styles.css";
import styled, { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { darkTheme, lightTheme } from "../../constants/theme";
import { Banner, BANNER_HEIGHT } from "../../features/Banner";
import { BottomBar } from "../../features/editor/BottomBar";
import { FullscreenDropzone } from "../../features/editor/FullscreenDropzone";
import { Toolbar } from "../../features/editor/Toolbar";
import useGraph from "../../features/editor/views/GraphView/stores/useGraph";
import useConfig from "../../store/useConfig";
import useFile from "../../store/useFile";

const ModalController = dynamic(() => import("../../features/modals/ModalController"));
const ExternalMode = dynamic(() => import("../../features/editor/ExternalMode"));
const TextEditor = dynamic(() => import("../../features/editor/TextEditor"), { ssr: false });
const LiveEditor = dynamic(() => import("../../features/editor/LiveEditor"), { ssr: false });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const StyledPageWrapper = styled.div`
  height: 100vh;
  width: 100%;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  height: ${`calc(100vh - 40px - ${BANNER_HEIGHT})`};

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const StyledTextEditor = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export function EditorPage() {
  const searchParams = useSearchParams();
  const { setColorScheme } = useMantineColorScheme();
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const fullscreen = useGraph(state => state.fullscreen);
  const clearGraph = useGraph(state => state.clearGraph);

  const jsonParam = searchParams.get("json");

  useEffect(() => {
    if (jsonParam) {
      checkEditorSession(jsonParam);
    } else {
      clearGraph();
    }
  }, [checkEditorSession, clearGraph, jsonParam]);

  useEffect(() => {
    setColorScheme(darkmodeEnabled ? "dark" : "light");
  }, [darkmodeEnabled, setColorScheme]);

  return (
    <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClient}>
        <ExternalMode />
        <ModalController />
        <StyledEditorWrapper>
          <StyledPageWrapper>
            {process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_MODE === "true" ? null : <Banner />}
            <Toolbar />
            <StyledEditorWrapper>
              <StyledEditor proportionalLayout={false}>
                <Allotment.Pane
                  preferredSize={450}
                  minSize={fullscreen ? 0 : 300}
                  maxSize={800}
                  visible={!fullscreen}
                >
                  <StyledTextEditor>
                    <TextEditor />
                    <BottomBar />
                  </StyledTextEditor>
                </Allotment.Pane>
                <Allotment.Pane minSize={0}>
                  <LiveEditor />
                </Allotment.Pane>
              </StyledEditor>
              <FullscreenDropzone />
            </StyledEditorWrapper>
          </StyledPageWrapper>
        </StyledEditorWrapper>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
