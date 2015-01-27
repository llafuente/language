; ModuleID = 'string.c'
target datalayout = "e-m:e-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

%struct.string = type { i64, i64, [0 x i8] }

@.str = private unnamed_addr constant [3 x i8] c"1\0A\00", align 1
@.str1 = private unnamed_addr constant [8 x i8] c"--> ??\0A\00", align 1
@.str2 = private unnamed_addr constant [8 x i8] c"--> %s\0A\00", align 1
@.str3 = private unnamed_addr constant [5 x i8] c"hola\00", align 1
@.str4 = private unnamed_addr constant [4 x i8] c"%s\0A\00", align 1

; Function Attrs: nounwind uwtable
define %struct.string* @reserve(i64 %len) #0 {
  %1 = alloca i64, align 8
  %s = alloca %struct.string*, align 8
  store i64 %len, i64* %1, align 8
  %2 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([3 x i8]* @.str, i32 0, i32 0))
  %3 = load i64* %1, align 8
  %4 = mul i64 %3, 1
  %5 = add i64 16, %4
  %6 = call noalias i8* @malloc(i64 %5) #3
  %7 = bitcast i8* %6 to %struct.string*
  store %struct.string* %7, %struct.string** %s, align 8
  %8 = load %struct.string** %s, align 8
  %9 = getelementptr inbounds %struct.string* %8, i32 0, i32 0
  store i64 0, i64* %9, align 8
  %10 = load i64* %1, align 8
  %11 = load %struct.string** %s, align 8
  %12 = getelementptr inbounds %struct.string* %11, i32 0, i32 1
  store i64 %10, i64* %12, align 8
  %13 = load %struct.string** %s, align 8
  %14 = getelementptr inbounds %struct.string* %13, i32 0, i32 2
  %15 = getelementptr inbounds [0 x i8]* %14, i32 0, i64 0
  store i8 97, i8* %15, align 1
  %16 = load %struct.string** %s, align 8
  %17 = getelementptr inbounds %struct.string* %16, i32 0, i32 2
  %18 = getelementptr inbounds [0 x i8]* %17, i32 0, i64 1
  store i8 0, i8* %18, align 1
  %19 = load %struct.string** %s, align 8
  ret %struct.string* %19
}

declare i32 @printf(i8*, ...) #1

; Function Attrs: nounwind
declare noalias i8* @malloc(i64) #2

; Function Attrs: nounwind uwtable
define i32 @main(i32 %argc, i8** %argv) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i32, align 4
  %3 = alloca i8**, align 8
  %s = alloca %struct.string*, align 8
  store i32 0, i32* %1
  store i32 %argc, i32* %2, align 4
  store i8** %argv, i8*** %3, align 8
  %4 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([8 x i8]* @.str1, i32 0, i32 0))
  %5 = call %struct.string* @reserve(i64 15)
  store %struct.string* %5, %struct.string** %s, align 8
  %6 = load %struct.string** %s, align 8
  %7 = getelementptr inbounds %struct.string* %6, i32 0, i32 2
  %8 = getelementptr inbounds [0 x i8]* %7, i32 0, i32 0
  %9 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([8 x i8]* @.str2, i32 0, i32 0), i8* %8)
  %10 = load %struct.string** %s, align 8
  %11 = getelementptr inbounds %struct.string* %10, i32 0, i32 2
  %12 = bitcast [0 x i8]* %11 to i8*
  call void @llvm.memcpy.p0i8.p0i8.i64(i8* %12, i8* getelementptr inbounds ([5 x i8]* @.str3, i32 0, i32 0), i64 5, i32 1, i1 false)
  %13 = load %struct.string** %s, align 8
  %14 = getelementptr inbounds %struct.string* %13, i32 0, i32 2
  %15 = getelementptr inbounds [0 x i8]* %14, i32 0, i32 0
  %16 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str4, i32 0, i32 0), i8* %15)
  %17 = load %struct.string** %s, align 8
  %18 = bitcast %struct.string* %17 to i8*
  call void @free(i8* %18) #3
  ret i32 0
}

; Function Attrs: nounwind
declare void @llvm.memcpy.p0i8.p0i8.i64(i8* nocapture, i8* nocapture readonly, i64, i32, i1) #3

; Function Attrs: nounwind
declare void @free(i8*) #2

attributes #0 = { nounwind uwtable "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #2 = { nounwind "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #3 = { nounwind }

!llvm.ident = !{!0}

!0 = metadata !{metadata !"clang version 3.5.1 (tags/RELEASE_351/final)"}
