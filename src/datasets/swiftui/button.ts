import { DecompileDataset } from '../types';

export const swiftuiButtonDataset: DecompileDataset = {
  id: 'swiftui-button',
  title: 'SwiftUI Button (Action Sheet)',
  description:
    '从声明式 SwiftUI 视图一路下潜到 SIL、LLVM IR 与 AArch64 指令的模拟编译管线。',
  stages: [
    {
      kind: 'source',
      lang: 'swift',
      title: 'Source: SwiftUI View',
      code: `import SwiftUI

struct ActionButton: View {
    var body: some View {
        Button {
            print("Launch sequence engaged")
        } label: {
            Label("Launch", systemImage: "rocket.fill")
                .font(.headline)
                .padding(12)
                .background(.ultraThinMaterial, in: Capsule())
        }
        .buttonStyle(.borderless)
    }
}

#Preview {
    ActionButton()
}`,
    },
    {
      kind: 'ast',
      nodes: [
        {
          id: 'root',
          label: 'StructDecl ActionButton',
          children: ['protocol', 'body'],
          details: 'inherits View',
        },
        {
          id: 'protocol',
          label: 'TypeAlias Requirement',
          children: ['bodyprop'],
        },
        {
          id: 'body',
          label: 'Computed Property body',
          children: ['buttoncall'],
          details: 'returns some View',
        },
        {
          id: 'bodyprop',
          label: 'OpaqueType some View',
        },
        {
          id: 'buttoncall',
          label: 'CallExpr Button.init(action:label:)',
          children: ['closure-action', 'closure-label', 'modifier'],
        },
        {
          id: 'closure-action',
          label: 'ClosureExpr',
          children: ['printcall'],
          details: 'captures nothing',
        },
        {
          id: 'printcall',
          label: 'CallExpr print("Launch sequence engaged")',
        },
        {
          id: 'closure-label',
          label: 'ClosureExpr',
          children: ['labelcall', 'fontcall', 'paddingcall', 'backgroundcall'],
        },
        {
          id: 'labelcall',
          label: 'CallExpr Label.init(_:systemImage:)',
        },
        {
          id: 'fontcall',
          label: 'CallExpr .font(.headline)',
        },
        {
          id: 'paddingcall',
          label: 'CallExpr .padding(12)',
        },
        {
          id: 'backgroundcall',
          label: 'CallExpr .background(_:in:)',
        },
        {
          id: 'modifier',
          label: 'MemberCallExpr .buttonStyle(.borderless)',
        },
      ],
      focusPath: ['root', 'body', 'buttoncall'],
    },
    {
      kind: 'ir',
      lang: 'sil',
      title: 'SIL: Canonical Lowering',
      code: `sil hidden @$s10ActionButtonV4bodyQrvp : $@convention(thin) () -> @owned View {
bb0:
  %0 = alloc_stack $@callee_guaranteed () -> ()
  %1 = function_ref @$s10ActionButtonV4bodyyyFyycfU_ : $@convention(thin) () -> ()
  store %1 to %0 : $*@callee_guaranteed () -> ()
  %2 = alloc_stack $@callee_guaranteed () -> @out View
  %3 = function_ref @$s10ActionButtonV4bodyyyFyycfU0_ : $@convention(thin) () -> @out View
  store %3 to %2 : $*@callee_guaranteed () -> @out View
  %4 = apply %1()
  %5 = apply %3()
  %6 = struct $Button<Label> (%4 : $(), %5 : $Label)
  %7 = function_ref @$s10ActionButtonV4bodyyyFyycfU1_ : $@convention(thin) (Button<Label>) -> Button<Label>
  %8 = apply %7(%6)
  return %8 : $Button<Label>
}`,
      map: [
        { from: 4, to: 4 },
        { from: 6, to: 8 },
        { from: 7, to: 9 },
        { from: 8, to: 10 },
      ],
    },
    {
      kind: 'ir',
      lang: 'llvm-ir',
      title: 'LLVM IR: SwiftUI Button Lowering',
      code: `define hidden swiftcc void @ActionButton.body(%View* swiftasync %0) {
entry:
  %stack = alloca %Button.Label, align 8
  call swiftcc void @print(%String* @str.launch_message)
  call swiftcc void @Label.init(%Button.Label* %stack, %String* @str.launch, %String* @sf.rocket_fill)
  call swiftcc void @Label.applyFont(%Button.Label* %stack, %Font* @Font.headline)
  call swiftcc void @Label.applyPadding(%Button.Label* %stack, double 12.000000e+00)
  call swiftcc void @Label.applyBackground(%Button.Label* %stack, %Material* @Material.ultrathin)
  call swiftcc void @Button.applyStyle(%Button.Label* %stack, i32 1)
  ret void
}`,
      map: [
        { from: 5, to: 11 },
        { from: 6, to: 13 },
        { from: 7, to: 14 },
        { from: 8, to: 15 },
        { from: 9, to: 16 },
        { from: 10, to: 17 },
      ],
    },
    {
      kind: 'binary',
      lang: 'aarch64',
      title: 'Disassembly Slice (AArch64)',
      code: `ActionButton.body:
    STP     x28, x27, [sp, #-32]!
    ADRP    x0, _str.launch_message@PAGE
    ADD     x0, x0, _str.launch_message@PAGEOFF
    BL      _print
    ADRP    x0, _str.launch@PAGE
    ADRP    x1, _sf.rocket_fill@PAGE
    ADD     x0, x0, _str.launch@PAGEOFF
    ADD     x1, x1, _sf.rocket_fill@PAGEOFF
    BL      _Label_init
    ADRP    x0, _Font.headline@PAGE
    BL      _Label_applyFont
    FMOV    d0, #12.0
    BL      _Label_applyPadding
    ADRP    x0, _Material.ultrathin@PAGE
    BL      _Label_applyBackground
    MOV     w0, #1
    BL      _Button_applyStyle
    LDP     x28, x27, [sp], #32
    RET`,
      map: [
        { from: 5, to: 3 },
        { from: 6, to: 5 },
        { from: 7, to: 6 },
        { from: 8, to: 7 },
        { from: 9, to: 8 },
        { from: 13, to: 10 },
        { from: 16, to: 11 },
      ],
    },
    {
      kind: 'rev',
      notes:
        '逆向时需凭经验恢复 Material 与 Style 枚举值，closure 捕获因内联而丢失原边界，打印语句因调试符号才得以保留。',
    },
  ],
};

