package pb;

public class PBapp {
	public static void main(String[] args) {
		try {
			new PB();
		} catch (Exception e) {
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
	}
}