(*
  * https://github.com/louisabraham/domical
  * https://alpha.iodide.io/notebooks/1627/
*)
open Printf

module Board = struct
  type t = int array (* 9×9, row-major representation.  A value of 0
                        means undecided. *)

  let is_valid c = c >= 1

  let get (b: t) (x, y) = b.(x + y * 9)

  let get_as_string (b: t) pos =
    let i = get b pos in
    if is_valid i then string_of_int i else "."

  let with_val (b: t) (x, y) v =
    let b = Array.copy b in
    b.(x + y * 9) <- v;
    b

  let of_list l : t =
    let b = Array.make 81 0 in
    List.iteri (fun y r -> List.iteri (fun x e ->
        b.(x + y * 9) <- if e >= 0 && e <= 9 then e else 0) r) l;
    b

  let print b =
    for y = 0 to 8 do
      for x = 0 to 8 do
        printf (if x = 0 then "%s" else if x mod 3 = 0 then " | %s"
                else "  %s")  (get_as_string b (x, y))
      done;
      if y < 8 then
        if y mod 3 = 2 then printf "\n--------+---------+--------\n"
        else printf "\n        |         |        \n"
      else printf "\n"
    done

  let available b (x, y) =
    let avail = Array.make 10 true in
    for i = 0 to 8 do
      avail.(get b (x, i)) <- false;
      avail.(get b (i, y)) <- false;
    done;
    let sq_x = x - x mod 3 and sq_y = y - y mod 3 in
    for x = sq_x to sq_x + 2 do
      for y = sq_y to sq_y + 2 do
        avail.(get b (x, y)) <- false;
      done;
    done;
    let av = ref [] in
    for i = 1 (* not 0 *) to 9 do if avail.(i) then av := i :: !av done;
    !av

  let next (x,y) = if x < 8 then (x+1, y) else (0, y+1)

  (** Try to fill the undecided entries. *)
  let rec fill b ((x,y) as pos) =
    if y > 8 then Some b (* filled all entries *)
    else if is_valid(get b pos) then fill b (next pos)
    else match available b pos with
      | [] -> None (* no solution *)
      | l -> try_values b pos l
  and try_values b pos = function
    | v :: l ->
      (match fill (with_val b pos v) (next pos) with
       | Some _ as res -> res
       | None -> try_values b pos l)
    | [] -> None
end

let sudoku b = match Board.fill b (0,0) with
  | Some b -> b
  | None -> failwith "sudoku: no solution"


let time f x =
  let t = Sys.time() in
  let fx = f x in
  Printf.printf "Execution time: %fs\n" (Sys.time() -. t);
  fx

let hardest_board =
  Board.of_list [[8; 0; 0; 0; 0; 0; 0; 0; 0];
                 [0; 0; 3; 6; 0; 0; 0; 0; 0];
                 [0; 7; 0; 0; 9; 0; 2; 0; 0];
                 [0; 5; 0; 0; 0; 7; 0; 0; 0];
                 [0; 0; 0; 0; 4; 5; 7; 0; 0];
                 [0; 0; 0; 1; 0; 0; 0; 3; 0];
                 [0; 0; 1; 0; 0; 0; 0; 6; 8];
                 [0; 0; 8; 5; 0; 0; 0; 1; 0];
                 [0; 9; 0; 0; 0; 0; 4; 0; 0]]
;;

Board.print (time sudoku hardest_board);;
