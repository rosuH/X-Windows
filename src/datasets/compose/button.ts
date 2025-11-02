import { DecompileDataset } from '../types';

export const composeButtonDataset: DecompileDataset = {
  id: 'compose-button',
  title: 'Jetpack Compose Launch Button',
  description:
    '展示 Kotlin Compose 声明式 UI 到 IR、JVM Bytecode 与 ART Smali 指令的离线编译旅程。',
  stages: [
    {
      kind: 'source',
      lang: 'kotlin',
      title: 'Source: Compose UI',
      code: `@Composable
fun LaunchButton(onLaunch: () -> Unit) {
    Button(onClick = onLaunch, modifier = Modifier.padding(12.dp)) {
        Icon(Icons.Filled.RocketLaunch, contentDescription = "Launch")
        Spacer(Modifier.width(8.dp))
        Column {
            Text("Launch", style = MaterialTheme.typography.titleMedium)
            Text("Sequence armed", style = MaterialTheme.typography.labelSmall)
        }
    }
}`,
    },
    {
      kind: 'ast',
      nodes: [
        {
          id: 'root',
          label: 'Fun LaunchButton',
          children: ['params', 'body'],
          details: '@Composable',
        },
        {
          id: 'params',
          label: 'Parameter onLaunch: () -> Unit',
        },
        {
          id: 'body',
          label: 'CallExpr Button',
          children: ['lambda-content'],
        },
        {
          id: 'lambda-content',
          label: 'LambdaExpr ButtonContent',
          children: ['icon', 'spacer', 'column'],
        },
        {
          id: 'icon',
          label: 'CallExpr Icon',
        },
        {
          id: 'spacer',
          label: 'CallExpr Spacer',
        },
        {
          id: 'column',
          label: 'CallExpr Column',
          children: ['text1', 'text2'],
        },
        {
          id: 'text1',
          label: 'CallExpr Text("Launch")',
        },
        {
          id: 'text2',
          label: 'CallExpr Text("Sequence armed")',
        },
      ],
      focusPath: ['root', 'body', 'lambda-content'],
    },
    {
      kind: 'ir',
      lang: 'kotlin',
      title: 'Compose IR (Simplified)',
      code: `IrFunction name=LaunchButton visibility=public inline=false attributes=[Composable]
  IrBlockBody origin=FUNCTION_BODY
    CALL 'androidx.compose.material.Button' type=kotlin.Unit
      onClick = GET_VAR 'onLaunch'
      modifier = CALL 'Modifier.padding'
      content = LAMBDA_0

  IrFunction name=LAMBDA_0 visibility=local inline=true attributes=[Composable]
    CALL 'Icon'
    CALL 'Spacer'
    CALL 'Column'
      block=IrBlock
        CALL 'Text' value="Launch"
        CALL 'Text' value="Sequence armed"`,
      map: [
        { from: 4, to: 3 },
        { from: 6, to: 5 },
        { from: 9, to: 7 },
        { from: 12, to: 10 },
      ],
    },
    {
      kind: 'ir',
      lang: 'jvm-bytecode',
      title: 'JVM Bytecode (excerpt)',
      code: `.method public final LaunchButton(Lkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;I)V
    .locals 8
    .param p1, "onLaunch"
    .param p2, "$composer"
    const v0, 0x6
    invoke-static {p2, v0}, Landroidx/compose/material/ButtonKt;->Button$default(...)
    return-void
.end method

.method static synthetic LaunchButton$content$1(...)V
    .locals 10
    invoke-static {}, Landroidx/compose/material/icons/filled/RocketLaunchKt;->getRocketLaunch()Landroidx/compose/ui/graphics/vector/ImageVector;
    invoke-static {v0, ...}, Landroidx/compose/material/IconKt;->Icon(...)
    invoke-static {8}, Landroidx/compose/foundation/layout/SpacerKt;->Spacer(...)
    invoke-static {}, Landroidx/compose/foundation/layout/ColumnKt;->Column(...)
    return-void
.end method`,
      map: [
        { from: 3, to: 2 },
        { from: 9, to: 6 },
        { from: 12, to: 7 },
        { from: 14, to: 8 },
      ],
    },
    {
      kind: 'binary',
      lang: 'smali',
      title: 'ART / Smali Segment',
      code: `.method private static LaunchButton$content$1$invoke(Landroidx/compose/runtime/Composer;I)V
    .locals 5
    const v0, 0x10
    invoke-static {}, Landroidx/compose/material/icons/filled/RocketLaunchKt;->getRocketLaunch()Landroidx/compose/ui/graphics/vector/ImageVector;
    move-result-object v1
    const-string v2, "Launch"
    invoke-static {v1, v2, p0, 0}, Landroidx/compose/material/IconKt;->Icon(...)
    const/high16 v3, 0x41000000    # 8.0f
    invoke-static {v3}, Landroidx/compose/ui/unit/Dp;->constructor-impl(F)F
    invoke-static {v3, p0, 0}, Landroidx/compose/foundation/layout/SpacerKt;->Spacer(...)
    invoke-static {p0, 0}, Landroidx/compose/foundation/layout/ColumnKt;->Column(...)
    const-string v4, "Sequence armed"
    invoke-static {v4, p0, 0}, Landroidx/compose/material/TextKt;->Text(...)
    return-void
.end method`,
      map: [
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 8, to: 8 },
        { from: 10, to: 9 },
      ],
    },
    {
      kind: 'rev',
      notes:
        'Compose runtime 将重组槽位与稳定性标记内联，逆向者须依据常量池推断 lambda 捕获，UI 层级需靠运行期追踪恢复。',
    },
  ],
};

