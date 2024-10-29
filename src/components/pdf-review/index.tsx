// PdfViewer.js
import React, { useEffect, useRef } from 'react';
import * as PDFJS from 'pdfjs-dist';
import { useSize } from 'ahooks';
import { PDFDocumentProxy } from 'pdfjs-dist';

PDFJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ url }) => {
  const canvasRef = useRef<any>();
  const size = useSize(document.querySelector('body'));
  // 新增一个函数来渲染PDF的所有页面
  const renderAllPdfPages = async (canvasRef: React.RefObject<HTMLCanvasElement>, pdf: PDFDocumentProxy, startPage: number, endPage: number) => {
    if (!canvasRef.current) return;
    for (let i = startPage; i <= endPage; i++) {
      try {
        const page = await pdf.getPage(i);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const context: any = canvasRef.current.getContext('2d');
        canvasRef.current.height = viewport.height * (endPage - startPage + 1); // 调整canvas高度以适应所有页面
        canvasRef.current.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // 渲染页面并偏移画布的y坐标以便下一页渲染在正确的位置
        context.translate(0, (i - startPage) * viewport.height);
        page.render(renderContext);
      } catch (error) {
        console.error(`Error rendering page ${i}:`, error);
      }
    }
  };

  useEffect(() => {
    const initPdf = async () => {
      if (!canvasRef.current) return;

      var loadingTask = PDFJS.getDocument(url);
      const pdf = await loadingTask.promise;

      const scale = 3;
      let totalHeight = 0;

      // 首先计算所有页面的总高度以设置canvas高度
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        totalHeight += viewport.height;
      }

      canvasRef.current.width = (await pdf.getPage(1)).getViewport({ scale }).width;
      canvasRef.current.height = totalHeight;

      const context = canvasRef.current.getContext('2d');

      // 重置绘图偏移，准备从顶部开始渲染页面
      context.translate(0, 0);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        // 在当前偏移处渲染页面，之后更新绘图偏移以准备渲染下一页
        await page.render(renderContext).promise;
        context.translate(0, viewport.height);
      }

      // loadingTask.promise.then(function (pdf) {
      //   pdf.getPage(1).then(function (page) {
      //     var scale = 1.5;
      //     var viewport = page.getViewport({ scale: scale });

      //     var context = canvasRef.current.getContext('2d');
      //     canvasRef.current.height = viewport.height;
      //     canvasRef.current.width = viewport.width;

      //     var renderContext = {
      //       canvasContext: context,
      //       viewport: viewport,
      //     };
      //     page.render(renderContext);
      //   });
      // });
    };

    initPdf();
  }, [url]);

  return <canvas width={'100%'} ref={canvasRef} />;
};

export default PdfViewer;
