import Foundation
import CoreText
import CoreGraphics
let fontURL = URL(fileURLWithPath: CommandLine.arguments[1])
let provider = CGDataProvider(url: fontURL as CFURL)!
let cgfont = CGFont(provider)!
let font = CTFontCreateWithGraphicsFont(cgfont, 100, nil, nil)
let text = CommandLine.arguments[2]
let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font]))
var paths: [String] = []
var bounds = CGRect.null
var usedFonts: [String] = []
func n(_ x: CGFloat) -> String { String(format:"%.3f", Double(x)) }
for run in CTLineGetGlyphRuns(line) as! [CTRun] {
 let count = CTRunGetGlyphCount(run)
 var glyphs = [CGGlyph](repeating: 0, count: count)
 var positions = [CGPoint](repeating: .zero, count: count)
 CTRunGetGlyphs(run, CFRange(location:0,length:0), &glyphs)
 CTRunGetPositions(run, CFRange(location:0,length:0), &positions)
 let attrs = CTRunGetAttributes(run) as NSDictionary
 let runFont = attrs[kCTFontAttributeName] as! CTFont
 usedFonts.append(CTFontCopyPostScriptName(runFont) as String)
 for i in 0..<count {
  guard let raw = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) else { continue }
  var transform = CGAffineTransform(a:1,b:0,c:0,d:-1,tx:positions[i].x,ty:-positions[i].y)
  let path = raw.copy(using:&transform)!
  bounds = bounds.union(path.boundingBoxOfPath)
  var d = ""
  path.applyWithBlock { pointer in
   let e = pointer.pointee; let p = e.points
   switch e.type {
   case .moveToPoint: d += "M\(n(p[0].x)),\(n(p[0].y)) "
   case .addLineToPoint: d += "L\(n(p[0].x)),\(n(p[0].y)) "
   case .addQuadCurveToPoint: d += "Q\(n(p[0].x)),\(n(p[0].y)) \(n(p[1].x)),\(n(p[1].y)) "
   case .addCurveToPoint: d += "C\(n(p[0].x)),\(n(p[0].y)) \(n(p[1].x)),\(n(p[1].y)) \(n(p[2].x)),\(n(p[2].y)) "
   case .closeSubpath: d += "Z "
   @unknown default: break
   }
  }
  paths.append(d)
 }
}
let data: [String:Any] = ["text":text,"paths":paths,"bounds":[bounds.minX,bounds.minY,bounds.width,bounds.height],"fonts":usedFonts]
let json = try JSONSerialization.data(withJSONObject:data,options:[.prettyPrinted,.sortedKeys])
print(String(data:json,encoding:.utf8)!)
